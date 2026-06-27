'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/freelancers`)
      .then(res => setFreelancers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    f.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0d1117)' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-secondary, #161b22)', borderBottom: '1px solid var(--border-subtle, #21262d)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 32px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary, #e6edf3)', marginBottom: 6 }}>
            Browse Freelancers
          </h1>
          <p style={{ color: 'var(--text-secondary, #8b949e)', fontSize: 15, marginBottom: 24 }}>
            Find skilled professionals ready to work on your tasks
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted, #6e7681)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name, skill, or bio..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 40,
                background: 'var(--bg-tertiary, #21262d)',
                border: '1px solid var(--border-default, #30363d)',
                borderRadius: 8, color: 'var(--text-primary, #e6edf3)',
                fontSize: 14, padding: '10px 14px 10px 40px', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default, #30363d)'}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {!loading && (
          <p style={{ color: 'var(--text-muted, #6e7681)', fontSize: 13, marginBottom: 24 }}>
            {filtered.length} freelancer{filtered.length !== 1 ? 's' : ''} found
            {search ? ` for "${search}"` : ''}
          </p>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary, #161b22)', border: '1px solid var(--border-subtle, #21262d)', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-tertiary, #21262d)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: 'var(--bg-tertiary, #21262d)', borderRadius: 4, width: '60%', marginBottom: 8 }} />
                    <div style={{ height: 12, background: 'var(--bg-tertiary, #21262d)', borderRadius: 4, width: '40%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {[...Array(3)].map((_, j) => <div key={j} style={{ height: 22, width: 60, background: 'var(--bg-tertiary, #21262d)', borderRadius: 20 }} />)}
                </div>
                <div style={{ height: 12, background: 'var(--bg-tertiary, #21262d)', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 12, background: 'var(--bg-tertiary, #21262d)', borderRadius: 4, width: '70%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <h3 style={{ color: 'var(--text-primary, #e6edf3)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              {search ? 'No freelancers found' : 'No freelancers yet'}
            </h3>
            <p style={{ color: 'var(--text-muted, #6e7681)', fontSize: 14 }}>
              {search ? 'Try a different search term' : 'Check back later'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(f => (
              <div key={f._id} style={{
                background: 'var(--bg-secondary, #161b22)',
                border: '1px solid var(--border-subtle, #21262d)',
                borderRadius: 12, padding: 24,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle, #21262d)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Profile header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  {f.image ? (
                    <img src={f.image} alt={f.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-default, #30363d)', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                      background: '#1f6feb', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18,
                    }}>
                      {f.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary, #e6edf3)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.name}
                    </h3>
                    <p style={{ color: '#58a6ff', fontSize: 13, fontWeight: 600 }}>
                      ${f.hourlyRate || 0}/hr
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {f.skills?.length > 0
                    ? f.skills.slice(0, 4).map(skill => (
                      <span key={skill} style={{ background: '#1c2e4a', color: '#58a6ff', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                        {skill}
                      </span>
                    ))
                    : <span style={{ color: 'var(--text-muted, #6e7681)', fontSize: 12 }}>No skills listed</span>
                  }
                  {f.skills?.length > 4 && (
                    <span style={{ background: 'var(--bg-tertiary, #21262d)', color: 'var(--text-muted, #6e7681)', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
                      +{f.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Bio */}
                <p style={{
                  color: 'var(--text-secondary, #8b949e)', fontSize: 13, lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  marginBottom: 16,
                }}>
                  {f.bio || 'No bio available.'}
                </p>

                {/* Footer */}
                <div style={{ borderTop: '1px solid var(--border-subtle, #21262d)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted, #6e7681)', fontSize: 12 }}>
                    {f.skills?.length || 0} skill{f.skills?.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#3fb950', fontSize: 12, fontWeight: 500 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}