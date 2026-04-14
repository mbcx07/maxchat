import { useEffect, useRef } from 'react'

export default function MessageList({ messages, isTyping }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function formatTime(ts) {
    const d = new Date(ts || Date.now())
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scroll-smooth">
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="flex justify-center my-8 animate-fade-up">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 border border-[#00ff88]/20 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-[#8888a0] text-sm">
              ¡Hola! Soy <span className="text-[#00ff88] font-semibold">Max</span>, tu asistente personal. 
              Escríbeme o llámame por voz.
            </p>
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={msg.id || i}
          className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
        >
          {msg.from === 'ai' && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 border border-[#00ff88]/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
              <span className="text-sm">📚</span>
            </div>
          )}
          
          <div
            className={`max-w-[80%] px-4 py-2.5 ${
              msg.from === 'user' ? 'bubble-user' : 'bubble-ai'
            }`}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {msg.text}
            </p>
            <p className={`text-[11px] mt-1 ${msg.from === 'user' ? 'text-[#00ff88]/40' : 'text-[#555]'}`}>
              {formatTime(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start animate-fade-up">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 border border-[#00ff88]/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
            <span className="text-sm">📚</span>
          </div>
          <div className="bubble-ai px-4 py-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#00ff88]/50 rounded-full"
                  style={{
                    animation: 'wave 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}