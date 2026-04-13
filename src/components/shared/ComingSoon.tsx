export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(56,240,255,0.08)',
          border: '1px solid rgba(56,240,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
        }}
      >
        🚀
      </div>
      <h1
        className="font-serif text-3xl"
        style={{ color: 'rgba(255,255,255,0.9)' }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: 9999,
          background: 'rgba(56,240,255,0.08)',
          border: '1px solid rgba(56,240,255,0.2)',
          color: '#38F0FF',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Coming Soon
      </div>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, maxWidth: 280 }}>
        This feature is under construction. Stay tuned.
      </p>
    </div>
  );
}
