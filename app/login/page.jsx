'use client';
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn.email({ email: form.email, password: form.password });
      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
        
      }
      // After successful login, get JWT token
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt-login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: form.email }),
});
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${form.email}`);
      const user = await userRes.json();
      if (user?.role === 'admin') router.push('/dashboard/admin');
      else if (user?.role === 'freelancer') router.push('/dashboard/freelancer');
      else router.push('/');
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: 'google', callbackURL: '/' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #0d1117)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Card */}
      <div style={{
        background: 'var(--bg-secondary, #161b22)',
        border: '1px solid var(--border-subtle, #21262d)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#58a6ff' }}>Skill</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary, #e6edf3)' }}>Swap</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary, #e6edf3)', textAlign: 'center', marginBottom: 6 }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6e7681)', fontSize: 14, marginBottom: 28 }}>
          Login to your SkillSwap account
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: '#3d1c1c', color: '#f85149',
            border: '1px solid #5c2222',
            padding: '10px 14px', borderRadius: 8,
            fontSize: 13, marginBottom: 20,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Form create */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary, #8b949e)', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" required placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary, #21262d)',
                color: 'var(--text-primary, #e6edf3)',
                border: '1px solid var(--border-default, #30363d)',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary, #8b949e)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password" required placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary, #21262d)',
                color: 'var(--text-primary, #e6edf3)',
                border: '1px solid var(--border-default, #30363d)',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#21262d' : '#1f6feb',
              color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '11px', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#388bfd'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1f6feb'; }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle, #21262d)' }} />
          <span style={{ padding: '0 14px', fontSize: 12, color: 'var(--text-muted, #6e7681)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle, #21262d)' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            background: 'transparent',
            color: 'var(--text-primary, #e6edf3)',
            border: '1px solid var(--border-default, #30363d)',
            borderRadius: 8, padding: '10px',
            fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary, #21262d)'; e.currentTarget.style.borderColor = '#58a6ff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-default, #30363d)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6e7681)', fontSize: 13, marginTop: 24 }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#58a6ff', fontWeight: 600, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}