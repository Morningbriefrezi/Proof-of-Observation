'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export function AstraFab() {
  const pathname = usePathname()

  if (pathname === '/chat') return null

  return (
    <Link
      href="/chat"
      aria-label="Ask ASTRA, your AI sky analyst"
      className="fixed z-50 bottom-20 right-5 md:bottom-6 md:right-6 group"
      style={{ bottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full transition-transform group-hover:scale-105 shadow-[0_8px_24px_rgba(56,240,255,0.35)]"
        style={{
          background: 'linear-gradient(135deg, #34d399 0%, #38F0FF 100%)',
        }}
      >
        <Sparkles className="text-white" size={24} strokeWidth={2.5} />
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: 'linear-gradient(135deg, #34d399, #38F0FF)', animationDuration: '4s' }}
        />
      </div>
      <div className="absolute right-[68px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 backdrop-blur text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
        Ask ASTRA
      </div>
    </Link>
  )
}
