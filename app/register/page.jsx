'use client';
import { useState } from 'react';
import { signUp, signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', image: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must have at least one capital letter';
    if (!/[a-z]/.test(pass)) return 'Password must have at least one lowercase letter';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const passError = validatePassword(form.password);
    if (passError) return setError(passError);
    setLoading(true);
    try {
      const res = await signUp.email({ email: form.email, password: form.password, name: form.name, image: form.image });
      if (res?.error) { setError(res.error.message || 'Registration failed'); setLoading(false); return; }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, { name: form.name, email: form.email, image: form.image, role: form.role });
      if (form.role === 'freelancer') router.push('/dashboard/freelancer');
      else router.push('/');
    } catch (err) {
      setError(err?.message || err?.response?.data?.error || 'Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: 'google', callbackURL: '/' });
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-tertiary, #21262d)',
    color: 'var(--text-primary, #e6edf3)',
    border: '1px solid var(--border-default, #30363d)',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 500,
    color: 'var(--text-secondary, #8b949e)', marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #0d1117)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--bg-secondary, #161b22)',
        border: '1px solid var(--border-subtle, #21262d)',
        borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#58a6ff' }}>Skill</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary, #e6edf3)' }}>Swap</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary, #e6edf3)', textAlign: 'center', marginBottom: 6 }}>
          Create Account
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted, #6e7681)', fontSize: 14, marginBottom: 28 }}>
          Join SkillSwap today
        </p>

        {error && (
          <div style={{ background: '#3d1c1c', color: '#f85149', border: '1px solid #5c2222', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" required placeholder="John Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" required placeholder="your@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label style={labelStyle}>Profile Photo URL <span style={{ color: '#6e7681', fontWeight: 400 }}>(optional)</span></label>
            <input type="url" placeholder="https://example.com/photo.jpg" value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" required placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted, #6e7681)', marginTop: 6 }}>
              Min 6 chars, one uppercase, one lowercase
            </p>
          </div>

          {/* Role */}
          <div>
            <label style={labelStyle}>I want to join as:</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['client', 'freelancer'].map(role => (
                <label key={role} onClick={() => setForm({ ...form, role })} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px', borderRadius: 8, cursor: 'pointer',
                  border: `2px solid ${form.role === role ? '#1f6feb' : 'var(--border-default, #30363d)'}`,
                  background: form.role === role ? '#1c2e4a' : 'var(--bg-tertiary, #21262d)',
                  transition: 'all 0.2s',
                }}>
                  <input type="radio" name="role" value={role} checked={form.role === role}
                    onChange={() => setForm({ ...form, role })}
                    style={{ accentColor: '#58a6ff' }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 500, color: form.role === role ? '#58a6ff' : 'var(--text-secondary, #8b949e)', textTransform: 'capitalize' }}>
                    {role === 'client' ? '👤 Client' : '💼 Freelancer'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: loading ? '#21262d' : '#1f6feb',
            color: '#fff', border: 'none', borderRadius: 8,
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle, #21262d)' }} />
          <span style={{ padding: '0 14px', fontSize: 12, color: 'var(--text-muted, #6e7681)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle, #21262d)' }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: '100%', background: 'transparent',
          color: 'var(--text-primary, #e6edf3)',
          border: '1px solid var(--border-default, #30363d)',
          borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
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
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#58a6ff', fontWeight: 600, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}