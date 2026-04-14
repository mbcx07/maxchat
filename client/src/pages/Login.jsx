import { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      localStorage.setItem('maxchat_user', name.trim())
      onLogin(name.trim())
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="w-full max-w-sm px-6 animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 border border-[#00ff88]/30 flex items-center justify-center glow-green">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MaxChat</h1>
          <p className="text-[#8888a0] mt-2 text-sm">Chat y llamada de voz con IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={20}
            autoFocus
            className="w-full px-5 py-4 bg-[#111118] border border-[#222] rounded-2xl text-white placeholder-[#555] focus:outline-none focus:border-[#00ff88]/50 focus:ring-2 focus:ring-[#00ff88]/20 transition-all text-lg"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#0a0a0f] font-bold rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-[#00ff88]/25 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Entrar al chat
          </button>
        </form>

        <p className="text-center text-[#555] text-xs mt-8">
          Powered by OpenClaw • Tu asistente personal
        </p>
      </div>
    </div>
  )
}