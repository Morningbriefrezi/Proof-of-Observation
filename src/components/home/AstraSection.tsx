'use client';

import Link from 'next/link';

const PILLS = [
  "Should I bet on Lyrids?",
  "What's visible tonight?",
  "Best market right now?",
  "Clear sky this week?",
];

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 1l1.2 2.6L9 4l-2 1.9.5 2.8L5 7.4 2.5 8.7 3 5.9 1 4l2.8-.4z" fill="currentColor" />
    </svg>
  );
}

export default function AstraSection() {
  return (
    <section className="home-astra-wrap">
      <div className="home-astra-inner">
        <div className="home-astra-left">
          <span className="home-astra-badge">
            <StarIcon />
            AI-powered
          </span>

          <h2 className="home-astra-headline">
            Meet <em>ASTRA</em>, your sky analyst
          </h2>

          <p className="home-astra-desc">
            Ask anything about tonight&apos;s sky, market odds, or what to observe. ASTRA pulls live weather, planet positions, and market data to give you an edge.
          </p>

          <div className="home-astra-pills">
            {PILLS.map((p) => (
              <Link
                key={p}
                href={`/chat?q=${encodeURIComponent(p)}`}
                className="home-astra-pill"
              >
                {p}
              </Link>
            ))}
          </div>

          <Link href="/chat" className="home-astra-cta">Talk to ASTRA</Link>
        </div>

        <aside className="home-astra-chat" aria-label="ASTRA preview">
          <div className="home-astra-chat-label">Live conversation</div>
          <div className="home-astra-chat-user">Is it worth betting on the Lyrids tonight?</div>
          <div className="home-astra-chat-bot">
            <strong>Yes, conditions favor it.</strong> ZHR 18 expected. Moon is 27% and sets before peak. Cloud cover 15% over Tbilisi. The 55% odds look reasonable — observe tonight for the 1.5x bonus.
          </div>
          <div className="home-astra-chat-status">ASTRA is ready…</div>
        </aside>
      </div>
    </section>
  );
}
