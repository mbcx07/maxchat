import { useState } from 'react'
import { Phone, PhoneOff } from 'lucide-react'

export default function VoiceCall({ voiceStatus, onStartVoice, onStopVoice, isRecording, onStartRecording, onStopRecording, sendVoiceAudio }) {
  const [callActive, setCallActive] = useState(false)

  const handleStartCall = async () => {
    const started = await onStartRecording()
    if (started) {
      onStartVoice()
      setCallActive(true)
    }
  }

  const handleEndCall = async () => {
    const audioData = await onStopRecording()
    if (audioData) {
      sendVoiceAudio(audioData)
    }
    onStopVoice()
    setCallActive(false)
  }

  const isProcessing = ['transcribing', 'thinking', 'speaking'].includes(voiceStatus.status)

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {!callActive ? (
        <button
          onClick={handleStartCall}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] flex items-center justify-center shadow-lg shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50 transition-all active:scale-95"
          title="Llamada de voz"
        >
          <Phone className="w-5 h-5 text-[#0a0a0f]" />
        </button>
      ) : (
        <>
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-medium">REC</span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
              <span className="text-[#00ff88] text-xs">{voiceStatus.text}</span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-1 bg-[#00ff88] rounded-full wave-bar" style={{ animationDelay: `${i * 0.15}s`, height: '8px' }} />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleEndCall}
            disabled={isProcessing}
            className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </>
      )}
    </div>
  )
}