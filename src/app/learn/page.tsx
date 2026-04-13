'use client';

import BackButton from '@/components/shared/BackButton';
import { BookOpen, Rocket } from 'lucide-react';

export default function LearnPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(139,92,246,0.12)',
        border: '1px solid rgba(139,92,246,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <BookOpen size={36} style={{ color: '#8B5CF6' }} />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Learn</h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 320, lineHeight: 1.6, margin: '0 0 8px' }}>
        Astronomy courses, quizzes, and planet guides.
      </p>
      <div style={{
        marginTop: 24,
        padding: '10px 20px',
        borderRadius: 20,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.25)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        color: '#8B5CF6', fontSize: 13, fontWeight: 600,
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
