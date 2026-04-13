'use client';

import BackButton from '@/components/shared/BackButton';
import { ShoppingBag, Rocket } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <ShoppingBag size={36} style={{ color: '#F59E0B' }} />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Marketplace</h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 320, lineHeight: 1.6, margin: '0 0 8px' }}>
        Telescopes, eyepieces, and astronomy gear — pay with card or SOL.
      </p>
      <div style={{
        marginTop: 24,
        padding: '10px 20px',
        borderRadius: 20,
        background: 'rgba(245,158,11,0.1)',
        border: '1px solid rgba(245,158,11,0.25)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        color: '#F59E0B', fontSize: 13, fontWeight: 600,
      }}>
        <Rocket size={14} />
        Coming Soon
      </div>
      <div style={{ marginTop: 40 }}>
        <BackButton />
      </div>
    </div>
  );
}
