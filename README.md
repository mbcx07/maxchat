# MaxChat 📚

Chat y llamada de voz en tiempo real con IA — Powered by OpenClaw

## Características

- 💬 **Chat en tiempo real** via Socket.io
- 🎙️ **Llamada de voz** — Habla y la IA responde con voz natural
- 🤖 **IA** — Respuestas inteligentes via OpenClaw
- 🔊 **TTS** — Voz humana natural con edge-tts (DaliaNeural)
- 📝 **STT** — Transcripción con Whisper
- 📱 **PWA** — Instalable en celular
- 🌙 **Dark mode** — Diseño oscuro estilo WhatsApp/Telegram
- ✨ **Responsive** — Mobile-first

## Arquitectura

```
Frontend (React + Vite + Tailwind)  ←→  Backend (Express + Socket.io)
                                           ├── Whisper (STT)
                                           ├── OpenClaw (AI)
                                           └── edge-tts (TTS)
```

## Setup

### Backend
```bash
cd server
npm install
npm start  # Runs on port 3002
```

### Frontend
```bash
cd client
npm install
npm run dev  # Dev server on port 5173
```

## Voz

La llamada de voz funciona así:
1. El usuario presiona el botón verde 📞
2. Se graba audio del micrófono
3. El audio se envía al servidor
4. Whisper transcribe el audio a texto
5. OpenClaw genera una respuesta inteligente
6. edge-tts convierte la respuesta a voz natural
7. El audio se reproduce en el navegador

## Tecnologías

- **Frontend:** React, Vite, Tailwind CSS, Socket.io Client, Lucide Icons
- **Backend:** Express, Socket.io, node-fetch
- **Voz:** Whisper (STT), edge-tts (TTS)
- **IA:** OpenClaw
- **PWA:** Service Worker, Web App Manifest