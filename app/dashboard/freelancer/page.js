'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// new section
export default function FreelancerDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [proposals, setProposals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [profile, setProfile] = useState({ name: '', image: '', skills: '', bio: '', hourlyRate: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [deliverableModal, setDeliverableModal] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
// useeffect(() => {
 useEffect(() => {
  if (!isPending && !session) router.push('/login');
  if (!isPending && session?.user?.email) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data.role !== 'freelancer') router.push('/dashboard/' + data.role);
      });
  }
}, [session, isPending]);
// fetch proposals, earnings, and profile when session is available
  useEffect(() => {
    if (session?.user?.email) {
      fetchProposals();
      fetchEarnings();
      fetchProfile();
    }
  }, [session]);

  const fetchProposals = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/proposals?freelancerEmail=${session.user.email}`);
      setProposals(res.data);
    } catch (err) {}
  };
//earnings 
  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/freelancer/${session.user.email}`);
      setEarnings(res.data);
    } catch (err) {}
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`);
      if (res.data) setProfile({ name: res.data.name || '', image: res.data.image || '', skills: res.data.skills?.join(', ') || '', bio: res.data.bio || '', hourlyRate: res.data.hourlyRate || '' });
    } catch (err) {}
  };
// handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`, {
        ...profile, skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean), hourlyRate: Number(profile.hourlyRate),
      });
      setProfileMsg('success');
    } catch (err) { setProfileMsg('error'); }
  };
// handle deliverable submission
  const handleSubmitDeliverable = async () => {
    if (!deliverableUrl) return alert('Please enter a URL');
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${deliverableModal.task_id}`, { status: 'completed', deliverable_url: deliverableUrl });
      setDeliverableModal(null); setDeliverableUrl(''); fetchProposals();
    } catch (err) {}
  };
// compute stats and active projects
  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    totalEarnings: earnings.reduce((sum, e) => sum + e.amount, 0),
  };
// 
  const activeProjects = proposals.filter(p => p.status === 'accepted');
// nav items and styles
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '▦' },
    { id: 'my-proposals', label: 'My Proposals', icon: '📬' },
    { id: 'active-projects', label: 'Active Projects', icon: '🚀' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'edit-profile', label: 'Edit Profile', icon: '✏️' },
  ];
// sidebar and main styles
  const s = {
    sidebar: { width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px 16px' },
    main: { flex: 1, background: 'var(--bg-primary)', padding: '32px 36px', minHeight: '100vh' },
    navBtn: (active) => ({ width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', background: active ? '#1a7f3c' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)' }),
    card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px' },
    input: { background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px', width: '100%', outline: 'none' },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 },
    btn: (color) => ({ background: color || '#1a7f3c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%' }),
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' },
    td: { padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' },
  };

  if (isPending) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>;
// return the dashboard layout
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a7f3c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</p>
            </div>
          </div>
          <span style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Freelancer</span>
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 14 }}>MENU</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={s.navBtn(activeTab === item.id)}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main section */}
      <main style={s.main}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{navItems.find(n => n.id === activeTab)?.label}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Manage your proposals and earnings</p>
        </div>

        {/* Overview sectionss */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Proposals', value: stats.total, color: 'var(--accent-blue)' },
              { label: 'Pending', value: stats.pending, color: 'var(--accent-amber)' },
              { label: 'Accepted', value: stats.accepted, color: 'var(--accent-green)' },
              { label: 'Total Earnings', value: `$${stats.totalEarnings}`, color: 'var(--accent-purple)' },
            ].map(stat => (
              <div key={stat.label} style={s.card}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{stat.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* My Proposals section */}
        {activeTab === 'my-proposals' && (
          <div style={{ maxWidth: 900 }}>
            {proposals.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                <p style={{ color: 'var(--text-secondary)' }}>No proposals submitted yet</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Task ID', 'Budget Bid', 'Days', 'Date Sent', 'Status'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map(p => (
                      <tr key={p._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.task_id?.slice(-8)}</td>
                        <td style={{ ...s.td, color: 'var(--accent-green)', fontWeight: 700 }}>${p.proposed_budget}</td>
                        <td style={s.td}>{p.estimated_days} days</td>
                        <td style={{ ...s.td, color: 'var(--text-muted)' }}>{new Date(p.submitted_at).toLocaleDateString()}</td>
                        <td style={s.td}>
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                            background: p.status === 'pending' ? 'var(--accent-amber-bg)' : p.status === 'accepted' ? 'var(--accent-green-bg)' : '#3d1c1c',
                            color: p.status === 'pending' ? 'var(--accent-amber)' : p.status === 'accepted' ? 'var(--accent-green)' : '#f85149' }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Active Projects section */}
        {activeTab === 'active-projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
            {activeProjects.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
                <p style={{ color: 'var(--text-secondary)' }}>No active projects yet</p>
              </div>
            ) : activeProjects.map(p => (
              <div key={p._id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Task ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: 13 }}>{p.task_id?.slice(-8)}</span></p>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>${p.proposed_budget}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{p.estimated_days} days</span>
                    </div>
                  </div>
                  <button onClick={() => setDeliverableModal(p)}
                    style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', border: '1px solid #1f4a1f', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Submit Deliverable
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings section */}
        {activeTab === 'earnings' && (
          <div style={{ maxWidth: 900 }}>
            {earnings.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
                <p style={{ color: 'var(--text-secondary)' }}>No earnings yet</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Task ID', 'Client', 'Amount', 'Date'].map(h => <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map(e => (
                      <tr key={e._id}
                        onMouseEnter={ev => ev.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{e.task_id?.slice(-8)}</td>
                        <td style={s.td}>{e.client_email}</td>
                        <td style={{ ...s.td, color: 'var(--accent-green)', fontWeight: 700 }}>${e.amount}</td>
                        <td style={{ ...s.td, color: 'var(--text-muted)' }}>{new Date(e.paid_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Profile */}
        {activeTab === 'edit-profile' && (
          <div style={{ maxWidth: 600 }}>
            <div style={s.card}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Edit Profile</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Update your public freelancer profile</p>
              </div>
              {profileMsg === 'success' && <div style={{ background: 'var(--accent-green-bg)', border: '1px solid #1f4a1f', color: 'var(--accent-green)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>✓ Profile updated successfully!</div>}
              {profileMsg === 'error' && <div style={{ background: '#3d1c1c', border: '1px solid #5c2222', color: '#f85149', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ Failed to update profile.</div>}
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                  { label: 'Profile Photo URL', key: 'image', type: 'url', placeholder: 'https://...' },
                  { label: 'Skills (comma separated)', key: 'skills', type: 'text', placeholder: 'React, Node.js, Design' },
                  { label: 'Hourly Rate (USD)', key: 'hourlyRate', type: 'number', placeholder: '25' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={s.label}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} style={s.input}
                      value={profile[field.key]} onChange={e => setProfile({ ...profile, [field.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={s.label}>Bio</label>
                  <textarea rows={4} style={{ ...s.input, resize: 'none' }}
                    value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                </div>
                <button type="submit" style={s.btn()}>Update Profile</button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Deliverable Modal */}
      {deliverableModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, margin: '0 16px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Submit Deliverable</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Paste your GitHub, Google Docs, or any project URL</p>
            <input type="url" placeholder="https://github.com/your-repo" style={{ ...s.input, marginBottom: 16 }}
              value={deliverableUrl} onChange={e => setDeliverableUrl(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSubmitDeliverable} style={{ ...s.btn(), flex: 1, padding: '10px' }}>Submit</button>
              <button onClick={() => { setDeliverableModal(null); setDeliverableUrl(''); }}
                style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', padding: '10px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}