'use client';
import Link from 'next/link';
import { signOut } from '@/lib/auth-client';
import { useUserRole } from '@/lib/useUserRole';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  // Shared hook — same role lookup the dashboard pages use, so Navbar
  // and the dashboards can never disagree about role or race each other
  // while the role fetch is still in flight.
  const { role: userRole, session } = useUserRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary',    '#0d1117');
      root.style.setProperty('--bg-secondary',  '#161b22');
      root.style.setProperty('--bg-tertiary',   '#21262d');
      root.style.setProperty('--border-default','#30363d');
      root.style.setProperty('--border-subtle', '#21262d');
      root.style.setProperty('--text-primary',  '#e6edf3');
      root.style.setProperty('--text-secondary','#8b949e');
      root.style.setProperty('--text-muted',    '#6e7681');
      root.style.setProperty('--background',    '#0d1117');
      root.style.setProperty('--foreground',    '#e6edf3');
    } else {
      root.style.setProperty('--bg-primary',    '#ffffff');
      root.style.setProperty('--bg-secondary',  '#f6f8fa');
      root.style.setProperty('--bg-tertiary',   '#eaeef2');
      root.style.setProperty('--border-default','#d0d7de');
      root.style.setProperty('--border-subtle', '#e8ecef');
      root.style.setProperty('--text-primary',  '#1c2128');
      root.style.setProperty('--text-secondary','#57606a');
      root.style.setProperty('--text-muted',    '#8c959f');
      root.style.setProperty('--background',    '#ffffff');
      root.style.setProperty('--foreground',    '#1c2128');
    }
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    applyTheme(next);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

 const getDashboardLink = () => {
  if (userRole === 'admin') return '/dashboard/admin';
  if (userRole === 'freelancer') return '/dashboard/freelancer';
  return '/dashboard/client';
};
  const isActive = (href) => pathname === href;

  const bg     = darkMode ? '#161b22' : '#ffffff';
  const border = darkMode ? '#21262d' : '#e5e7eb';
  const text   = darkMode ? '#8b949e' : '#374151';
  const logo2  = darkMode ? '#e6edf3' : '#111827';

  return (
    <nav style={{
      background: bg,
      borderBottom: `1px solid ${border}`,
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? (darkMode ? '0 1px 16px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.08)') : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#58a6ff', letterSpacing: '-0.5px' }}>Skill</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: logo2, letterSpacing: '-0.5px' }}>Swap</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
          {[['/', 'Home'], ['/browse-tasks', 'Browse Tasks'], ['/browse-freelancers', 'Browse Freelancers']].map(([href, label]) => (
            <Link key={href} href={href} style={{
              color: isActive(href) ? (darkMode ? '#e6edf3' : '#111827') : text,
              textDecoration: 'none', fontSize: 14, fontWeight: isActive(href) ? 600 : 400,
              padding: '8px 14px', borderRadius: 6,
              borderBottom: isActive(href) ? '2px solid #58a6ff' : '2px solid transparent',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = darkMode ? '#e6edf3' : '#111827'}
              onMouseLeave={e => { if (!isActive(href)) e.currentTarget.style.color = text; }}
            >
              {label}
            </Link>
          ))}

          {session && (
            <Link href={getDashboardLink()} style={{
              color: isActive(getDashboardLink()) ? (darkMode ? '#e6edf3' : '#111827') : text,
              textDecoration: 'none', fontSize: 14,
              fontWeight: isActive(getDashboardLink()) ? 600 : 400,
              padding: '8px 14px', borderRadius: 6,
              borderBottom: isActive(getDashboardLink()) ? '2px solid #58a6ff' : '2px solid transparent',
              transition: 'color 0.15s',
            }}>
              Dashboard
            </Link>
          )}

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: border, margin: '0 10px' }} />

          {/* Toggle — ONE only, desktop */}
          <button onClick={toggleTheme} title={darkMode ? 'Light mode' : 'Dark mode'} style={{
            background: darkMode ? '#21262d' : '#f3f4f6',
            border: `1px solid ${border}`,
            borderRadius: 999, width: 48, height: 26,
            cursor: 'pointer', padding: '3px',
            display: 'flex', alignItems: 'center',
            transition: 'background 0.3s',
            flexShrink: 0,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: darkMode ? '#58a6ff' : '#f59e0b',
              transform: darkMode ? 'translateX(0px)' : 'translateX(22px)',
              transition: 'transform 0.3s, background 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, lineHeight: 1,
            }}>
              {darkMode ? '🌙' : '☀️'}
            </div>
          </button>

          {/* Auth */}
          <div style={{ marginLeft: 8 }}>
            {session ? (
              <button onClick={handleLogout} style={{
                background: 'transparent',
                color: '#f85149',
                border: '1px solid #5c2222',
                padding: '7px 18px', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3d1c1c'; e.currentTarget.style.borderColor = '#f85149'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#5c2222'; }}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" style={{
                background: '#1f6feb', color: '#fff',
                padding: '8px 20px', borderRadius: 8,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                display: 'inline-block',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#388bfd'}
                onMouseLeave={e => e.currentTarget.style.background = '#1f6feb'}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile: hamburger only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: text, padding: 4 }}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden" style={{
          background: bg, borderTop: `1px solid ${border}`,
          padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {[['/', 'Home'], ['/browse-tasks', 'Browse Tasks'], ['/browse-freelancers', 'Browse Freelancers']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              color: isActive(href) ? '#58a6ff' : text,
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              padding: '10px 12px', borderRadius: 8,
              background: isActive(href) ? (darkMode ? '#1c2e4a' : '#eff6ff') : 'transparent',
            }}>
              {label}
            </Link>
          ))}
          {session && (
            <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} style={{
              color: text, textDecoration: 'none', fontSize: 14,
              fontWeight: 500, padding: '10px 12px', borderRadius: 8,
            }}>
              Dashboard
            </Link>
          )}

          <div style={{ height: 1, background: border, margin: '8px 0' }} />

          {/* Toggle inside mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 12px' }}>
            <span style={{ fontSize: 13, color: text }}>
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button onClick={toggleTheme} style={{
              background: darkMode ? '#21262d' : '#f3f4f6',
              border: `1px solid ${border}`,
              borderRadius: 999, width: 44, height: 24,
              cursor: 'pointer', padding: '2px',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: darkMode ? '#58a6ff' : '#f59e0b',
                transform: darkMode ? 'translateX(0px)' : 'translateX(20px)',
                transition: 'transform 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>
                {darkMode ? '🌙' : '☀️'}
              </div>
            </button>
          </div>

          {session ? (
            <button onClick={handleLogout} style={{
              background: '#3d1c1c', color: '#f85149',
              border: '1px solid #5c2222', padding: '10px 16px',
              borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left',
            }}>
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{
              background: '#1f6feb', color: '#fff',
              padding: '10px 16px', borderRadius: 8,
              fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center',
            }}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}