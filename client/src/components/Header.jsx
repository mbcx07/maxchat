import { Wifi, WifiOff } from 'lucide-react'

export default function Header({ username, connected }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#0d0d14]/95 backdrop-blur-md border-b border-[#1a1a2e] sticky top-0 z-10">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/10 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
        <span className="text-lg">📚</span>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-white font-semibold text-[17px] leading-tight">Max</h1>
        <p className="text-[12px] flex items-center gap-1">
          <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-[#00ff88]' : 'bg-red-500'}`} />
          <span className={connected ? 'text-[#00ff88]/70' : 'text-red-400/70'}>
            {connected ? 'En línea' : 'Desconectado'}
          </span>
          <span className="text-[#444] mx-1">•</span>
          <span className="text-[#555]">{username}</span>
        </p>
      </div>

      <div className="flex-shrink-0">
        {connected ? (
          <Wifi className="w-5 h-5 text-[#00ff88]/50" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-500/50" />
        )}
      </div>
    </div>
  )
}