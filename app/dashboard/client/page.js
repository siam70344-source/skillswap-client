'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ClientDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ title: '', category: 'Design', description: '', budget: '', deadline: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

 useEffect(() => {
  if (!isPending && !session) router.push('/login');
  if (!isPending && session?.user?.email) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data.role !== 'client') router.push('/dashboard/' + data.role);
      });
  }
}, [session, isPending]);

  useEffect(() => {
    if (session?.user?.email) fetchTasks();
  }, [session]);

  useEffect(() => {
    if (activeTab === 'proposals' && tasks.length > 0) fetchProposals();
  }, [activeTab, tasks]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/client/${session.user.email}`);
      setTasks(res.data);
    } catch (err) {}
  };

  const fetchProposals = async () => {
    try {
      const allProposals = [];
      for (const task of tasks) {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/proposals?taskId=${task._id}`);
        allProposals.push(...res.data.map(p => ({ ...p, taskTitle: task.title })));
      }
      setProposals(allProposals);
    } catch (err) {}
  };

  const handlePostTask = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        ...form, budget: Number(form.budget), client_email: session.user.email,
      });
      setSuccess('Task posted successfully!');
      setForm({ title: '', category: 'Design', description: '', budget: '', deadline: '' });
      fetchTasks();
    } catch (err) { setError('Failed to post task'); }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {}
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${editTask._id}`, editTask);
      setEditTask(null); fetchTasks();
    } catch (err) {}
  };

  const handleAcceptProposal = async (proposal) => {
    try {
      const task = tasks.find(t => t._id === proposal.task_id);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`, {
        taskId: proposal.task_id, taskTitle: task.title,
        amount: proposal.proposed_budget, clientEmail: session.user.email,
        freelancerEmail: proposal.freelancer_email,
      });
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/proposals/${proposal._id}`, { status: 'accepted' });
      window.location.href = res.data.url;
    } catch (err) { alert('Payment failed. Try again.'); }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/proposals/${proposalId}`, { status: 'rejected' });
      fetchProposals();
    } catch (err) {}
  };

  const stats = {
    total: tasks.length,
    open: tasks.filter(t => t.status === 'open').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '▦' },
    { id: 'post-task', label: 'Post a Task', icon: '+' },
    { id: 'my-tasks', label: 'My Tasks', icon: '☰' },
    { id: 'proposals', label: 'Proposals', icon: '✉' },
  ];

  const s = {
    sidebar: { width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px 16px' },
    main: { flex: 1, background: 'var(--bg-primary)', padding: '32px 36px', minHeight: '100vh' },
    navBtn: (active) => ({ width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', background: active ? 'var(--accent-blue-btn)' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)' }),
    card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px' },
    statCard: (color) => ({ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }),
    input: { background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px', width: '100%', outline: 'none' },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 },
    btn: { background: 'var(--accent-blue-btn)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%' },
  };

  if (isPending) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        {/* Profile */}
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-blue-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</p>
            </div>
          </div>
          <span style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Client</span>
        </div>

        {/* Nav */}
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

      {/* Main */}
      <main style={s.main}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Manage your tasks and freelancer proposals</p>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Tasks', value: stats.total, icon: '☰', color: 'var(--accent-blue)' },
              { label: 'Open Tasks', value: stats.open, icon: '◎', color: 'var(--accent-green)' },
              { label: 'In Progress', value: stats.inProgress, icon: '⏱', color: 'var(--accent-amber)' },
              { label: 'Completed', value: stats.completed, icon: '✓', color: 'var(--accent-purple)' },
            ].map(stat => (
              <div key={stat.label} style={s.statCard()}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Task */}
        {activeTab === 'post-task' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ ...s.card }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Post a New Task</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fill in the details to find the right freelancer</p>
              </div>
              {error && <div style={{ background: '#3d1c1c', border: '1px solid #5c2222', color: '#f85149', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}
              {success && <div style={{ background: 'var(--accent-green-bg)', border: '1px solid #1f4a1f', color: 'var(--accent-green)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>✓ {success}</div>}
              <form onSubmit={handlePostTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={s.label}>Task Title</label>
                  <input required placeholder="e.g. Design a logo for my startup" style={s.input}
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label style={s.label}>Category</label>
                  <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Design', 'Writing', 'Development', 'Marketing', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Description</label>
                  <textarea required rows={4} placeholder="Describe what you need done..." style={{ ...s.input, resize: 'none' }}
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={s.label}>Budget (USD)</label>
                    <input type="number" required placeholder="200" style={s.input}
                      value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                  </div>
                  <div>
                    <label style={s.label}>Deadline</label>
                    <input type="date" required style={s.input}
                      value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                </div>
                <button type="submit" style={s.btn}>Post Task</button>
              </form>
            </div>
          </div>
        )}

        {/* My Tasks */}
        {activeTab === 'my-tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
            {tasks.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>No tasks posted yet</p>
                <button onClick={() => setActiveTab('post-task')} style={{ ...s.btn, width: 'auto', padding: '8px 20px', marginTop: 8 }}>Post a Task</button>
              </div>
            ) : tasks.map(task => (
              <div key={task._id} style={s.card}>
                {editTask?._id === task._id ? (
                  <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input style={s.input} value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} />
                    <textarea rows={3} style={{ ...s.input, resize: 'none' }} value={editTask.description} onChange={e => setEditTask({ ...editTask, description: e.target.value })} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" style={{ ...s.btn, width: 'auto', padding: '8px 16px' }}>Save</button>
                      <button type="button" onClick={() => setEditTask(null)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>{task.category}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                          background: task.status === 'open' ? 'var(--accent-green-bg)' : task.status === 'in-progress' ? 'var(--accent-amber-bg)' : 'var(--bg-tertiary)',
                          color: task.status === 'open' ? 'var(--accent-green)' : task.status === 'in-progress' ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                          {task.status}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{task.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{task.description?.slice(0, 120)}...</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>${task.budget}</span>
                        <span style={{ color: 'var(--text-muted)' }}>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {task.status === 'open' && (
                        <button onClick={() => setEditTask(task)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                      )}
                      <button onClick={() => handleDelete(task._id)} style={{ background: '#3d1c1c', color: '#f85149', border: '1px solid #5c2222', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Proposals */}
        {activeTab === 'proposals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
            {proposals.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No proposals yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Proposals will appear here once freelancers apply</p>
              </div>
            ) : proposals.map(proposal => (
              <div key={proposal._id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', fontWeight: 700, fontSize: 13 }}>
                        {proposal.freelancer_email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{proposal.freelancer_email}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Task: {proposal.taskTitle}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 10 }}>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>${proposal.proposed_budget}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{proposal.estimated_days} days</span>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600,
                        background: proposal.status === 'pending' ? 'var(--accent-amber-bg)' : proposal.status === 'accepted' ? 'var(--accent-green-bg)' : '#3d1c1c',
                        color: proposal.status === 'pending' ? 'var(--accent-amber)' : proposal.status === 'accepted' ? 'var(--accent-green)' : '#f85149' }}>
                        {proposal.status}
                      </span>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 8, padding: '10px 14px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontStyle: 'italic' }}>"{proposal.cover_note}"</p>
                    </div>
                  </div>
                  {proposal.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleAcceptProposal(proposal)} style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', border: '1px solid #1f4a1f', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Accept & Pay</button>
                      <button onClick={() => handleRejectProposal(proposal._id)} style={{ background: '#3d1c1c', color: '#f85149', border: '1px solid #5c2222', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}