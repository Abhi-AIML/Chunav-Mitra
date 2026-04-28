export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Ashoka Chakra animated icon */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-10 h-10 chakra-spin">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#triGradient)" strokeWidth="3" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50" y1="10" x2="50" y2="25"
                stroke="#4c6ef5"
                strokeWidth="1.5"
                transform={`rotate(${i * 15} 50 50)`}
                opacity={0.6}
              />
            ))}
            <circle cx="50" cy="50" r="6" fill="#4c6ef5" />
            <defs>
              <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="50%" stopColor="#4c6ef5" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient-saffron">Chunav</span>{' '}
            <span className="text-white">Mitra</span>
          </h1>
          <p className="text-[11px] text-white/40 font-medium tracking-wide uppercase">
            India's Agentic Election Education Companion
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">AI Active</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-xs text-white/30">Powered by Google Gemini</span>
      </div>
    </header>
  );
}
