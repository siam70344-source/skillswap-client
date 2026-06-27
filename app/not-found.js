import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary, #0d1117)', padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>

        {/* 404 number */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <h1 style={{
            fontSize: 140, fontWeight: 800, lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '2px #30363d',
            letterSpacing: '-4px', userSelect: 'none',
          }}>
            404
          </h1>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 48 }}>🔍</span>
          </div>
        </div>

        {/* Text */}
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #e6edf3)', marginBottom: 12 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary, #8b949e)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            background: '#1f6feb', color: '#fff',
            padding: '10px 24px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            display: 'inline-block', transition: 'background 0.2s',
          }}>
            Go Back Home
          </Link>
          <Link href="/browse-tasks" style={{
            background: 'transparent', color: 'var(--text-secondary, #8b949e)',
            padding: '10px 24px', borderRadius: 8,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            border: '1px solid var(--border-default, #30363d)',
            display: 'inline-block',
          }}>
            Browse Tasks
          </Link>
        </div>

      </div>
    </div>
  );
}