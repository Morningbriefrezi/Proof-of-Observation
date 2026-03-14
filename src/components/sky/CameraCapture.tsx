'use client';

import { useState, useRef } from 'react';
import { generateSimPhoto } from '@/hooks/useCamera';
import { RotateCcw, ImagePlus } from 'lucide-react';

interface CameraCaptureProps {
  missionName: string;
  onCapture: (photo: string) => void;
}

export default function CameraCapture({ missionName, onCapture }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleRetake = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── PREVIEW ──────────────────────────────────────────────────────────────────
  if (preview) {
    return (
      <div className="flex flex-col gap-4 mt-2">
        {/* Photo */}
        <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src={preview}
            alt="Observation"
            className="w-full object-cover"
            style={{ maxHeight: '52vh' }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-2"
            style={{ background: 'linear-gradient(to top, rgba(7,11,20,0.9), transparent)' }}
          >
            <p className="text-[#FFD166]/70 text-[9px] font-mono tracking-widest uppercase">
              STELLAR · {missionName}
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => onCapture(preview)}
          className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FFD166, #CC9A33)', color: '#070B14' }}
        >
          Submit for Verification →
        </button>
        <button
          onClick={handleRetake}
          className="w-full py-3 rounded-xl text-sm text-slate-500 flex items-center justify-center gap-2 transition-all hover:text-slate-300"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <RotateCcw size={13} /> Retake
        </button>
      </div>
    );
  }

  // ── UPLOAD ZONE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Upload area */}
      <button
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="relative w-full flex flex-col items-center justify-center gap-4 rounded-2xl transition-all duration-200 cursor-pointer group"
        style={{
          height: '52vh',
          minHeight: 240,
          background: 'rgba(255,255,255,0.02)',
          border: '1.5px dashed rgba(255,255,255,0.1)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,209,102,0.3)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105"
          style={{ background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.15)' }}
        >
          <ImagePlus size={24} className="text-[#FFD166]/70" />
        </div>
        <div className="text-center px-6">
          <p className="text-white text-sm font-medium mb-1">Take a photo or upload</p>
          <p className="text-slate-600 text-xs leading-relaxed">
            Point at <span className="text-slate-400">{missionName}</span> and capture your observation
          </p>
        </div>
        <p className="text-slate-700 text-[10px]">Tap to open camera</p>
      </button>

      {/* Sim photo option */}
      <button
        onClick={() => setPreview(generateSimPhoto(missionName))}
        className="w-full py-3 rounded-xl text-xs text-slate-600 transition-all hover:text-slate-400 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        Use simulated photo (demo)
      </button>
    </div>
  );
}
