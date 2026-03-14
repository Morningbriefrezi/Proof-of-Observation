'use client';

interface MintAnimationProps {
  done: boolean;
}

export default function MintAnimation({ done }: MintAnimationProps) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#070B14] grid place-items-center">
      <div className="flex flex-col items-center gap-8 px-6 text-center">

        {/* Ring animation */}
        <div className="relative w-24 h-24">
          {/* Static base ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          />

          {/* Spinning arc */}
          {!done && (
            <div
              className="absolute inset-0 rounded-full animate-[spin_2s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 75%, rgba(255,209,102,0.8) 100%)',
                WebkitMask: 'radial-gradient(circle, transparent 42px, black 43px)',
                mask: 'radial-gradient(circle, transparent 42px, black 43px)',
              }}
            />
          )}

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {done ? (
              <svg
                width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="#FFD166" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                className="animate-[mint-success_0.4s_ease-out_forwards]"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#FFD166', boxShadow: '0 0 12px rgba(255,209,102,0.6)' }}
              />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p
            className="text-white font-semibold text-base tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {done ? 'Sealed on Solana' : 'Sealing Observation'}
          </p>
          <p className="text-slate-600 text-xs">
            {done ? 'Your proof has been recorded.' : 'Writing to Solana devnet…'}
          </p>

          {!done && (
            <div className="flex justify-center gap-1.5 pt-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#FFD166]/40 animate-bounce"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
