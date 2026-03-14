'use client';

import { useEffect, useState, useRef } from 'react';
import { useCamera, generateSimPhoto } from '@/hooks/useCamera';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  missionName: string;
  onCapture: (photo: string) => void;
}

export default function CameraCapture({ missionName, onCapture }: CameraCaptureProps) {
  const { videoRef, stream, error, facingMode, startCamera, flipCamera, stopCamera, capture } = useCamera();
  const [preview, setPreview] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const autoSimDone = useRef(false);

  useEffect(() => {
    startCamera('environment');
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error === 'permission_denied' && !autoSimDone.current && !preview) {
      autoSimDone.current = true;
      setPreview(generateSimPhoto(missionName));
    }
  }, [error, missionName, preview]);

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 120);
    const photo = capture(missionName);
    stopCamera();
    setPreview(photo);
  };

  const handleRetake = () => {
    setPreview(null);
    autoSimDone.current = false;
    startCamera('environment');
  };

  // ── PREVIEW SCREEN ──────────────────────────────────────────────────────────
  if (preview) {
    return (
      <div className="flex flex-col flex-1 w-full -mx-4 -mt-4 sm:-mx-0 sm:-mt-0">
        {/* Photo full-bleed */}
        <div className="relative flex-1 min-h-0 bg-black">
          <img
            src={preview}
            alt="Observation preview"
            className="w-full h-full object-cover"
            style={{ maxHeight: '55vh' }}
          />
          {/* Watermark */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <p className="text-[#FFD166] text-[10px] font-mono tracking-widest">
              STELLAR · {missionName.toUpperCase()} · SIMULATED
            </p>
          </div>
        </div>

        {/* Action strip */}
        <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
          <button
            onClick={() => onCapture(preview)}
            className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
              color: '#070B14',
            }}
          >
            Submit for Verification →
          </button>
          <button
            onClick={handleRetake}
            className="w-full py-3 rounded-xl text-sm text-slate-400 transition-all flex items-center justify-center gap-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <RotateCcw size={14} />
            Retake
          </button>
        </div>
      </div>
    );
  }

  // ── SIMULATED FALLBACK (no camera permission) ────────────────────────────────
  if (error === 'permission_denied') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-5 py-10 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.15)' }}>
          <span className="text-2xl">📷</span>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-1">Camera unavailable</p>
          <p className="text-slate-600 text-xs">A simulated photo will be used for demo</p>
        </div>
        <button
          onClick={() => setPreview(generateSimPhoto(missionName))}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
            color: '#070B14',
          }}
        >
          Generate Photo →
        </button>
      </div>
    );
  }

  // ── LIVE VIEWFINDER ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 w-full -mx-4 -mt-4 sm:-mx-0 sm:-mt-0">
      {/* Viewfinder */}
      <div className="relative bg-black flex-1 overflow-hidden" style={{ minHeight: '50vh' }}>
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        {/* Flash overlay */}
        {flash && <div className="absolute inset-0 bg-white/30 pointer-events-none" />}

        {/* Corner brackets */}
        {[
          { top: '12%', left: '8%',  borderTop: '2px solid rgba(255,209,102,0.7)', borderLeft: '2px solid rgba(255,209,102,0.7)' },
          { top: '12%', right: '8%', borderTop: '2px solid rgba(255,209,102,0.7)', borderRight: '2px solid rgba(255,209,102,0.7)' },
          { bottom: '18%', left: '8%',  borderBottom: '2px solid rgba(255,209,102,0.7)', borderLeft: '2px solid rgba(255,209,102,0.7)' },
          { bottom: '18%', right: '8%', borderBottom: '2px solid rgba(255,209,102,0.7)', borderRight: '2px solid rgba(255,209,102,0.7)' },
        ].map((style, i) => (
          <div key={i} className="absolute w-6 h-6 pointer-events-none" style={style} />
        ))}

        {/* Crosshair dot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '8%' }}>
          <div className="w-1 h-1 rounded-full bg-white/40" />
        </div>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
          <span className="text-[#FFD166] text-[10px] font-mono tracking-widest uppercase">
            STELLAR · {missionName}
          </span>
          <span className="text-white/40 text-[10px] font-mono">{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Flip camera */}
        <button
          onClick={flipCamera}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <RefreshCw size={14} className="text-white/70" />
        </button>
      </div>

      {/* Shutter strip */}
      <div className="flex items-center justify-center px-4 py-6"
        style={{ background: '#070B14' }}>
        <button
          onClick={handleCapture}
          className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 0 0 6px rgba(255,255,255,0.04)',
          }}
        >
          <div className="w-11 h-11 rounded-full" style={{ background: '#fff' }} />
        </button>
      </div>
    </div>
  );
}
