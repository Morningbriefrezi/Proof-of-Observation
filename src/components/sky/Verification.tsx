'use client';

import { CheckCircle2, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import type { FarmHawkResult, PollinetStatus } from '@/lib/types';

interface VerificationProps {
  photo: string;
  farmhawk: FarmHawkResult;
  pollinet: PollinetStatus;
  stars: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  onMint: () => void;
}

export default function Verification({ photo, farmhawk, pollinet, stars, timestamp, latitude, longitude, onMint }: VerificationProps) {
  const conditionOk = farmhawk.verified;

  return (
    <div className="flex flex-col w-full -mx-4 -mt-4 sm:-mx-0 sm:-mt-0">

      {/* Photo header */}
      <div className="relative bg-black" style={{ height: '38vh', minHeight: 180 }}>
        <img
          src={photo}
          alt="Observation"
          className="w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
        {/* Verified badge overlay */}
        <div
          className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          <CheckCircle2 size={12} className="text-[#34d399]" />
          <span className="text-white text-xs font-medium">Observation Captured</span>
        </div>
        <div
          className="absolute bottom-3 right-4 text-[10px] font-mono text-white/40"
        >
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Data panel */}
      <div className="px-4 pt-5 pb-4 flex flex-col gap-4">

        {/* Location + time */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-semibold">Verified</p>
            <p className="text-slate-600 text-xs mt-0.5">
              {latitude.toFixed(4)}°N {longitude.toFixed(4)}°E
            </p>
          </div>
          <div
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
            style={{
              background: conditionOk ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
              border: `1px solid ${conditionOk ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
              color: conditionOk ? '#34d399' : '#fbbf24',
            }}
          >
            {conditionOk ? 'Clear sky' : 'Cloudy'}
          </div>
        </div>

        {/* Weather data table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#38F0FF]/60" />
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Satellite Data</span>
          </div>
          {[
            { label: 'Cloud Cover',  value: `${farmhawk.cloudCover}%` },
            { label: 'Visibility',   value: farmhawk.visibility },
            { label: 'Temperature',  value: `${farmhawk.temperature}°C` },
            { label: 'Humidity',     value: `${farmhawk.humidity}%` },
            { label: 'Wind Speed',   value: `${farmhawk.windSpeed} km/h` },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <span className="text-slate-600 text-xs">{row.label}</span>
              <span className="text-white text-xs font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Condition verdict + hash */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {conditionOk
              ? <><CheckCircle2 size={12} className="text-[#34d399]" /><span className="text-[#34d399] text-xs">Conditions verified</span></>
              : <><AlertTriangle size={12} className="text-amber-400" /><span className="text-amber-400 text-xs">Poor — proceed at own risk</span></>
            }
          </div>
          <span className="text-slate-700 text-[10px] font-mono">
            {farmhawk.oracleHash.slice(0, 6)}…{farmhawk.oracleHash.slice(-4)}
          </span>
        </div>

        {/* Network */}
        <div className="flex items-center gap-2">
          {pollinet.online
            ? <Wifi size={12} className="text-slate-600" />
            : <WifiOff size={12} className="text-slate-600" />
          }
          <span className="text-slate-600 text-xs">
            Pollinet · {pollinet.online ? 'Direct to Solana' : `Mesh relay (${pollinet.peers} peers)`}
          </span>
        </div>

        {/* Oracle receipt (collapsed) */}
        {farmhawk.receipt && (
          <details>
            <summary className="text-slate-700 text-[10px] cursor-pointer hover:text-slate-500 transition-colors select-none">
              View oracle receipt ›
            </summary>
            <div
              className="mt-2 p-3 rounded-lg font-mono text-[9px] text-slate-700 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <p>oracle: <span className="text-slate-500">{farmhawk.receipt.oracle}</span></p>
              <p>hash: <span className="text-[#FFD166]/60">{farmhawk.receipt.hash}</span></p>
              <p>feed: {farmhawk.receipt.feed}</p>
              <p>coords: {farmhawk.receipt.coordinates.lat.toFixed(4)}N {farmhawk.receipt.coordinates.lon.toFixed(4)}E</p>
              <p>ts: {farmhawk.receipt.timestamp}</p>
            </div>
          </details>
        )}

        {/* CTA */}
        <button
          onClick={onMint}
          className="w-full py-4 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-98 mt-1"
          style={{
            background: 'linear-gradient(135deg, #FFD166, #CC9A33)',
            color: '#070B14',
          }}
        >
          Create Proof  ✦  +{stars} stars
        </button>
      </div>
    </div>
  );
}
