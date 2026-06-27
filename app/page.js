'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/latest`)
      .then(res => setTasks(res.data))
      .catch(() => {});
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/freelancers`)
      .then(res => setFreelancers(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const categoryStyle = (cat) => {
    const map = {
      Design:      { bg: '#1c2e4a', color: '#58a6ff' },
      Development: { bg: '#1a2e1a', color: '#3fb950' },
      Writing:     { bg: '#2a1f3d', color: '#bc8cff' },
      Marketing:   { bg: '#2d2000', color: '#e3b341' },
      Other:       { bg: '#21262d', color: '#8b949e' },
    };
    return map[cat] || map['Other'];
  };

  return (
    <main style={{ background: '#0d1117', color: '#e6edf3', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 60%, #1c2e4a 100%)', padding: '96px 24px 80px', borderBottom: '1px solid #21262d' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#1c2e4a', color: '#58a6ff', border: '1px solid #1f6feb55', padding: '4px 16px', borderRadius: 20, fontSize: 13, marginBottom: 24 }}>
            ⚡ Trusted by 2,400+ freelancers
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.25, marginBottom: 20, color: '#e6edf3' }}>
            Get your tasks done by{' '}
            <span style={{ color: '#58a6ff' }}>skilled freelancers</span>
          </h1>
          <p style={{ fontSize: 16, color: '#8b949e', marginBottom: 36, lineHeight: 1.7 }}>
            Post a task, receive proposals, hire the best freelancer, and get it done — fast and affordable.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/client" style={{ background: '#1f6feb', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}>
              Post a Task
            </Link>
            <Link href="/browse-tasks" style={{ background: 'transparent', color: '#e6edf3', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, border: '1px solid #30363d', textDecoration: 'none' }}>
              Browse Tasks
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: '#161b22', borderBottom: '1px solid #21262d', padding: '24px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
        {[
          { num: '1,240+', label: 'Tasks Posted' },
          { num: '890+',   label: 'Freelancers' },
          { num: '$48K+',  label: 'Total Paid Out' },
          { num: '4.8★',   label: 'Avg. Rating' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#58a6ff' }}>{s.num}</div>
            <div style={{ fontSize: 12, color: '#6e7681', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '72px 24px', borderBottom: '1px solid #21262d' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#8b949e', marginBottom: 48, fontSize: 15 }}>Three simple steps to get work done</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { step: '01', title: 'Post a Task', desc: 'Describe what you need done, set your budget and deadline.', icon: '📝', color: '#58a6ff', bg: '#1c2e4a' },
              { step: '02', title: 'Get Proposals', desc: 'Skilled freelancers will send you their best offers.', icon: '📬', color: '#bc8cff', bg: '#2a1f3d' },
              { step: '03', title: 'Hire & Pay', desc: 'Choose the best freelancer, pay securely via Stripe.', icon: '✅', color: '#3fb950', bg: '#1a2e1a' },
            ].map(item => (
              <div key={item.step} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '28px 24px', textAlign: 'center', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ background: item.bg, color: item.color, display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, marginBottom: 12, letterSpacing: 1 }}>
                  STEP {item.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e6edf3', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Tasks ── */}
      <section style={{ padding: '72px 24px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e6edf3' }}>Latest Open Tasks</h2>
              <p style={{ color: '#8b949e', fontSize: 14, marginTop: 4 }}>Fresh opportunities waiting for you</p>
            </div>
            <Link href="/browse-tasks" style={{ color: '#58a6ff', fontSize: 14, textDecoration: 'none' }}>View all →</Link>
          </div>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6e7681', background: '#161b22', borderRadius: 12, border: '1px solid #21262d' }}>
              No tasks yet. Be the first to post!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {tasks.map(task => {
                const cs = categoryStyle(task.category);
                return (
                  <Link href={`/browse-tasks/${task._id}`} key={task._id} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '20px', height: '100%', transition: 'border-color 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#30363d'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}>
                      <span style={{ background: cs.bg, color: cs.color, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                        {task.category}
                      </span>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', margin: '12px 0 8px', lineHeight: 1.4 }}>{task.title}</h3>
                      <p style={{ color: '#8b949e', fontSize: 13, marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </p>
                      <div style={{ borderTop: '1px solid #21262d', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#3fb950' }}>${task.budget}</span>
                        <span style={{ fontSize: 12, color: '#6e7681' }}>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                      <p style={{ color: '#6e7681', fontSize: 12, marginTop: 8 }}>By: {task.client_email}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Freelancers ── */}
      <section style={{ padding: '72px 24px', background: '#161b22', borderBottom: '1px solid #21262d' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e6edf3' }}>Top Freelancers</h2>
              <p style={{ color: '#8b949e', fontSize: 14, marginTop: 4 }}>Vetted professionals ready to work</p>
            </div>
            <Link href="/browse-freelancers" style={{ color: '#58a6ff', fontSize: 14, textDecoration: 'none' }}>View all →</Link>
          </div>
          {freelancers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6e7681', background: '#0d1117', borderRadius: 12, border: '1px solid #21262d' }}>
              No freelancers yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {freelancers.map(f => (
                <div key={f._id} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 12, padding: '20px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#30363d'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <img src={f.image || `https://ui-avatars.com/api/?name=${f.name}&background=1f6feb&color=fff`}
                      alt={f.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #30363d' }} />
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: 15, color: '#e6edf3' }}>{f.name}</h3>
                      <p style={{ color: '#58a6ff', fontSize: 13 }}>${f.hourlyRate}/hr</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {f.skills?.slice(0, 3).map(skill => (
                      <span key={skill} style={{ background: '#1c2e4a', color: '#58a6ff', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>{skill}</span>
                    ))}
                  </div>
                  <p style={{ color: '#8b949e', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {f.bio || 'No bio yet.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Platform Stats ── */}
      <section style={{ padding: '72px 24px', background: '#0d1117', borderBottom: '1px solid #21262d' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>Platform Statistics</h2>
          <p style={{ color: '#8b949e', marginBottom: 48, fontSize: 15 }}>Growing every day</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { label: 'Tasks Posted', value: '500+', color: '#58a6ff', bg: '#1c2e4a' },
              { label: 'Freelancers',  value: '200+', color: '#3fb950', bg: '#1a2e1a' },
              { label: 'Total Payouts',value: '$50K+',color: '#e3b341', bg: '#2d2000' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.color}33`, borderRadius: 12, padding: '28px 16px' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: stat.color, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ color: '#8b949e', fontSize: 14 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#161b22', borderTop: '1px solid #21262d', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>
                Skill<span style={{ color: '#58a6ff' }}>Swap</span>
              </h3>
              <p style={{ color: '#6e7681', fontSize: 13, lineHeight: 1.7 }}>
                A freelance micro-task platform connecting clients with skilled freelancers.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#e6edf3', fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['/', 'Home'], ['/browse-tasks', 'Browse Tasks'], ['/browse-freelancers', 'Browse Freelancers']].map(([href, label]) => (
                  <Link key={href} href={href} style={{ color: '#6e7681', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: '#e6edf3', fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Contact</h4>
              <p style={{ color: '#6e7681', fontSize: 13 }}>support@skillswap.com</p>
              <div style={{ marginTop: 14 }}>
                <a href="#" style={{ color: '#6e7681', display: 'inline-block' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #21262d', paddingTop: 20, textAlign: 'center', color: '#6e7681', fontSize: 13 }}>
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </div>
        </div>
      </footer>

    </main>
  );
}