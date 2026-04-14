const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('/home/ubuntu/.openclaw/workspace/projects/maxchat/public'));

// ─── Whisper STT ───────────────────────────────────────────
async function transcribeAudio(audioBuffer) {
  const tmpFile = `/tmp/maxchat_audio_${Date.now()}.wav`;
  fs.writeFileSync(tmpFile, audioBuffer);
  
  return new Promise((resolve, reject) => {
    // Try local Whisper service on port 5000 first
    const FormData = require('form-data');
    const form = new FormData();
    form.append('audio', fs.createReadStream(tmpFile), {
      filename: 'audio.wav',
      contentType: 'audio/wav'
    });

    fetch('http://localhost:5000/asr', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
      timeout: 30000
    })
    .then(r => r.json())
    .then(data => {
      fs.unlinkSync(tmpFile);
      resolve(data.text || data.transcription || '');
    })
    .catch(() => {
      // Fallback: whisper CLI
      execFile('whisper', [tmpFile, '--model', 'tiny', '--language', 'es', '--output_format', 'txt', '--output_dir', '/tmp'], 
        { timeout: 30000 }, (err, stdout, stderr) => {
        try { fs.unlinkSync(tmpFile); } catch(e) {}
        const txtFile = tmpFile.replace('.wav', '.txt');
        try {
          const text = fs.readFileSync(txtFile, 'utf8').trim();
          try { fs.unlinkSync(txtFile); } catch(e) {}
          resolve(text);
        } catch(e) {
          resolve(stdout.trim() || '');
        }
      });
    });
  });
}

// ─── TTS with edge-tts (natural voice) ─────────────────────
async function synthesizeSpeech(text) {
  const outputFile = `/tmp/maxchat_tts_${Date.now()}.mp3`;
  const voiceName = 'es-MX-DaliaNeural'; // Natural Mexican Spanish voice
  
  return new Promise((resolve, reject) => {
    execFile('edge-tts', [
      '--text', text,
      '--voice', voiceName,
      '--rate', '+0%',
      '--pitch', '+0Hz',
      '--write-media', outputFile
    ], { timeout: 20000 }, (err) => {
      if (err) {
        console.error('TTS error:', err);
        reject(err);
        return;
      }
      const audioBuffer = fs.readFileSync(outputFile);
      try { fs.unlinkSync(outputFile); } catch(e) {}
      resolve(audioBuffer);
    });
  });
}

// ─── OpenClaw AI ───────────────────────────────────────────
async function getAIResponse(message, username) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, username }),
      timeout: 60000
    });
    const data = await response.json();
    return data.reply || data.response || data.message || 'No pude procesar tu mensaje.';
  } catch (e) {
    console.error('OpenClaw error:', e.message);
    return 'Disculpa, estoy teniendo problemas para conectarme. Intenta de nuevo en un momento.';
  }
}

// ─── REST Endpoints ────────────────────────────────────────

app.post('/api/transcribe', async (req, res) => {
  try {
    const audioData = req.body.audio;
    if (!audioData) return res.status(400).json({ error: 'No audio data' });
    
    const buffer = Buffer.from(audioData, 'base64');
    const text = await transcribeAudio(buffer);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text' });
    
    const audioBuffer = await synthesizeSpeech(text);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, username } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });
    
    const reply = await getAIResponse(message, username);
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Socket.io Real-time ───────────────────────────────────

io.on('connection', (socket) => {
  let username = 'Anónimo';
  console.log('User connected:', socket.id);

  socket.on('user:join', (name) => {
    username = name || 'Anónimo';
    console.log(`${username} joined`);
  });

  // Text chat
  socket.on('chat:message', async (data) => {
    try {
      const reply = await getAIResponse(data.message, username);
      socket.emit('chat:reply', {
        text: reply,
        timestamp: Date.now()
      });
    } catch (e) {
      socket.emit('chat:reply', {
        text: 'Error al procesar tu mensaje.',
        timestamp: Date.now()
      });
    }
  });

  // Voice call flow
  socket.on('voice:start', () => {
    socket.emit('voice:status', { status: 'listening', text: '🎙️ Escuchando...' });
  });

  socket.on('voice:audio', async (audioData) => {
    try {
      socket.emit('voice:status', { status: 'transcribing', text: '✍️ Transcribiendo...' });
      
      const buffer = Buffer.from(audioData, 'base64');
      const transcript = await transcribeAudio(buffer);
      
      if (!transcript || transcript.trim().length === 0) {
        socket.emit('voice:status', { status: 'error', text: 'No detecté audio. Intenta de nuevo.' });
        return;
      }

      socket.emit('voice:transcript', { text: transcript });
      socket.emit('voice:status', { status: 'thinking', text: '🤔 Pensando...' });

      const reply = await getAIResponse(transcript, username);

      socket.emit('voice:reply', { text: reply });
      socket.emit('voice:status', { status: 'speaking', text: '🗣️ Hablando...' });

      // Synthesize speech
      const audioBuffer = await synthesizeSpeech(reply);
      const audioBase64 = audioBuffer.toString('base64');
      socket.emit('voice:audio', { audio: audioBase64 });

      // Also emit as chat message for history
      socket.emit('chat:user-message', { text: transcript, timestamp: Date.now() });
      socket.emit('chat:reply', { text: reply, timestamp: Date.now() });

    } catch (e) {
      console.error('Voice error:', e);
      socket.emit('voice:status', { status: 'error', text: 'Error en la llamada de voz.' });
    }
  });

  socket.on('voice:stop', () => {
    socket.emit('voice:status', { status: 'idle', text: '' });
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected:`, socket.id);
  });
});

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('MaxChat - Build the client first');
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MaxChat server running on http://0.0.0.0:${PORT}`);
});