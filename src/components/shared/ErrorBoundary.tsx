'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-[#FFD166] text-4xl mb-4">✦</p>
            <h1 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Something went wrong
            </h1>
            <p className="text-slate-500 text-sm mb-6">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-black"
              style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)' }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
