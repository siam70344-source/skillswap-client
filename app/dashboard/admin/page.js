'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState('');

useEffect(() => {
  if (!isPending && !session) router.push('/login');
  if (!isPending && session?.user?.email) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data.role !== 'admin') router.push('/dashboard/' + data.role);
      });
  }
}, [session, isPending]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers();
      fetchTasks();
      fetchPayments();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      setUsers(res.data);
    } catch (err) { console.error('Failed to load users:', err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) { console.error('Failed to load tasks:', err); }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`);
      setPayments(res.data);
    } catch (err) { console.error('Failed to load payments:', err); }
  };

  const handleToggleBlock = async (user) => {
    setLoadingAction(user.email);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.email}`, { isBlocked: !user.isBlocked });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Could not update this user.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setLoadingAction(taskId);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Could not delete this task.');
    } finally {
      setLoadingAction(null);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalTasks: tasks.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    activeTasks: tasks.filter(t => t.status === 'in-progress').length,
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '▦' },
    { id: 'manage-users', label: 'Manage Users', icon: '◑' },
    { id: 'manage-tasks', label: 'Manage Tasks', icon: '☰' },
    { id: 'transactions', label: 'Transactions', icon: '$' },
  ];

  const s = {
    sidebar: { width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px 16px' },
    main: { flex: 1, background: 'var(--bg-primary)', padding: '32px 36px', minHeight: '100vh' },
    navBtn: (active) => ({ width: '100%', textAlign: 'left', padding: '9px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s', background: active ? 'var(--accent-purple)' : 'transparent', color: active ? '#1a1025' : 'var(--text-secondary)' }),
    card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px' },
    statCard: { background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' },
    td: { padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' },
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
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1025', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</p>
            </div>
          </div>
          <span style={{ background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Admin</span>
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

      {/* Main */}
      <main style={s.main}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Platform-wide oversight and controls</p>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '◑', color: 'var(--accent-blue)' },
              { label: 'Total Tasks', value: stats.totalTasks, icon: '☰', color: 'var(--accent-purple)' },
              { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: '$', color: 'var(--accent-green)' },
              { label: 'Active Tasks', value: stats.activeTasks, icon: '⏱', color: 'var(--accent-amber)' },
            ].map(stat => (
              <div key={stat.label} style={s.statCard}>
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

        {/* Manage Users */}
        {activeTab === 'manage-users' && (
          <div style={{ maxWidth: 980 }}>
            {users.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>◑</div>
                <p style={{ color: 'var(--text-secondary)' }}>No users found</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.email}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...s.td, color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</td>
                        <td style={s.td}>{user.email}</td>
                        <td style={s.td}>
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                            background: user.role === 'admin' ? 'var(--accent-purple-bg)' : user.role === 'client' ? 'var(--accent-blue-bg)' : 'var(--accent-green-bg)',
                            color: user.role === 'admin' ? 'var(--accent-purple)' : user.role === 'client' ? 'var(--accent-blue)' : 'var(--accent-green)' }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                            background: user.isBlocked ? '#3d1c1c' : 'var(--accent-green-bg)',
                            color: user.isBlocked ? '#f85149' : 'var(--accent-green)' }}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td style={s.td}>
                          <button
                            onClick={() => handleToggleBlock(user)}
                            disabled={loadingAction === user.email || user.role === 'admin'}
                            style={{
                              background: user.isBlocked ? 'var(--accent-green-bg)' : '#3d1c1c',
                              color: user.isBlocked ? 'var(--accent-green)' : '#f85149',
                              border: `1px solid ${user.isBlocked ? '#1f4a1f' : '#5c2222'}`,
                              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                              cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
                              opacity: (loadingAction === user.email || user.role === 'admin') ? 0.5 : 1,
                            }}>
                            {loadingAction === user.email ? '...' : user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Manage Tasks */}
        {activeTab === 'manage-tasks' && (
          <div style={{ maxWidth: 980 }}>
            {tasks.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>☰</div>
                <p style={{ color: 'var(--text-secondary)' }}>No tasks found</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Title', 'Category', 'Client', 'Budget', 'Status', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...s.td, color: 'var(--text-primary)', fontWeight: 500, maxWidth: 220 }}>{task.title}</td>
                        <td style={s.td}>{task.category}</td>
                        <td style={{ ...s.td, color: 'var(--text-muted)' }}>{task.client_email}</td>
                        <td style={{ ...s.td, color: 'var(--accent-green)', fontWeight: 700 }}>${task.budget}</td>
                        <td style={s.td}>
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                            background: task.status === 'open' ? 'var(--accent-green-bg)' : task.status === 'in-progress' ? 'var(--accent-amber-bg)' : 'var(--bg-tertiary)',
                            color: task.status === 'open' ? 'var(--accent-green)' : task.status === 'in-progress' ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                            {task.status}
                          </span>
                        </td>
                        <td style={s.td}>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            disabled={loadingAction === task._id}
                            style={{
                              background: '#3d1c1c', color: '#f85149', border: '1px solid #5c2222',
                              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              opacity: loadingAction === task._id ? 0.5 : 1,
                            }}>
                            {loadingAction === task._id ? 'Deleting…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transactions section*/}
        {activeTab === 'transactions' && (
          <div style={{ maxWidth: 980 }}>
            {payments.length === 0 ? (
              <div style={{ ...s.card, textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>$</div>
                <p style={{ color: 'var(--text-secondary)' }}>No transactions yet</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Client', 'Freelancer', 'Payout', 'Date', 'Status'].map(h => <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={s.td}>{payment.client_email}</td>
                        <td style={s.td}>{payment.freelancer_email}</td>
                        <td style={{ ...s.td, color: 'var(--accent-green)', fontWeight: 700 }}>${payment.amount}</td>
                        <td style={{ ...s.td, color: 'var(--text-muted)' }}>{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '—'}</td>
                        <td style={s.td}>
                          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                            background: payment.payment_status === 'paid' || payment.payment_status === 'succeeded' ? 'var(--accent-green-bg)' : 'var(--accent-amber-bg)',
                            color: payment.payment_status === 'paid' || payment.payment_status === 'succeeded' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                            {payment.payment_status}
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
      </main>
    </div>
  );
}