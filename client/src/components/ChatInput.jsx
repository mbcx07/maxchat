import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !disabled) {
      onSend(text.trim())
      setText('')
      inputRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) } }}
        placeholder="Escribe un mensaje..."
        rows={1}
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-[#111118] border border-[#222] rounded-2xl text-white placeholder-[#555] focus:outline-none focus:border-[#00ff88]/30 resize-none text-[15px] leading-tight max-h-32 disabled:opacity-50"
        style={{ minHeight: '44px' }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-11 h-11 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] flex items-center justify-center flex-shrink-0 transition-all hover:shadow-lg hover:shadow-[#00ff88]/25 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5 text-[#0a0a0f]" />
      </button>
    </form>
  )
}