'use client';

import React from 'react';

interface QuizStripProps {
  question: string;
  quizId?: string;
  rewardStars?: number;
  onPlay: () => void;
  compact?: boolean;
}

export default function QuizStrip({
  question,
  rewardStars = 10,
  onPlay,
  compact,
}: QuizStripProps) {
  return (
    <div className={`quiz-strip ${compact ? 'compact' : ''}`}>
      <div className="quiz-badge">?</div>
      <div className="quiz-text">
        <div className="quiz-label">Tonight&apos;s quiz · +{rewardStars} ✦ each</div>
        <div className="quiz-q">{question}</div>
      </div>
      <button type="button" className="quiz-cta" onClick={onPlay}>
        Play →
      </button>

      <style jsx>{`
        .quiz-strip {
          margin-top: 22px;
          padding: 18px 24px;
          background:
            linear-gradient(135deg, rgba(132,101,203,0.1), transparent 60%),
            #0A1220;
          border: 1px solid rgba(132,101,203,0.3);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        }

        .quiz-badge {
          width: 44px;
          height: 44px;
          background: rgba(132,101,203,0.15);
          border: 1px solid rgba(132,101,203,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8465CB;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-style: italic;
          font-weight: 600;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }

        .quiz-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #8465CB;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .quiz-q {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          color: #F5F1E8;
          line-height: 1.2;
        }

        .quiz-cta {
          padding: 10px 18px;
          background: transparent;
          border: 1px solid #8465CB;
          color: #8465CB;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background 0.18s ease, color 0.18s ease;
        }
        .quiz-cta:hover { background: rgba(132,101,203,0.1); color: #F5F1E8; }

        .quiz-strip.compact {
          grid-template-columns: auto 1fr;
          padding: 14px 16px;
          gap: 14px;
        }
        .quiz-strip.compact .quiz-badge { width: 38px; height: 38px; font-size: 18px; }
        .quiz-strip.compact .quiz-q { font-size: 15px; }
        .quiz-strip.compact .quiz-cta {
          grid-column: span 2;
          margin-top: 10px;
          width: 100%;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
