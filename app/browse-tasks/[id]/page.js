'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import axios from 'axios';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [task, setTask] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [form, setForm] = useState({ proposed_budget: '', estimated_days: '', cover_note: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`)
      .then(res => setTask(res.data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`)
        .then(res => res.json())
        .then(data => setUserRole(data?.role))
        .catch(() => {});
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!session) return router.push('/login');
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/proposals`, {
        task_id: id,
        freelancer_email: session.user.email,
        proposed_budget: Number(form.proposed_budget),
        estimated_days: Number(form.estimated_days),
        cover_note: form.cover_note,
      });
      setSuccess('Proposal submitted successfully!');
      setForm({ proposed_budget: '', estimated_days: '', cover_note: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit proposal');
    }
    setLoading(false);
  };

  const s = {
    input: { background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px', width: '100%', outline: 'none' },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 },
    card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '24px' },
  };

  if (!task) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Back button */}
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Back to Tasks
        </button>

        {/* Task Details */}
        <div style={{ ...s.card, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
              {task.category}
            </span>
            <span style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
              {task.status}
            </span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{task.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{task.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Budget', value: `$${task.budget}`, color: 'var(--accent-green)' },
              { label: 'Deadline', value: new Date(task.deadline).toLocaleDateString() },
              { label: 'Posted by', value: task.client_email },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                <p style={{ fontWeight: 600, fontSize: 14, color: item.color || 'var(--text-primary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal Form - Only for freelancers */}
        {userRole === 'freelancer' && task.status === 'open' && (
          <div style={s.card}>
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Submit a Proposal</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tell the client why you're the best fit</p>
            </div>

            {error && <div style={{ background: '#3d1c1c', border: '1px solid #5c2222', color: '#f85149', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}
            {success && <div style={{ background: 'var(--accent-green-bg)', border: '1px solid #1f4a1f', color: 'var(--accent-green)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>✓ {success}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={s.label}>Your Bid (USD)</label>
                  <input type="number" required placeholder="e.g. 150" style={s.input}
                    value={form.proposed_budget} onChange={e => setForm({ ...form, proposed_budget: e.target.value })} />
                </div>
                <div>
                  <label style={s.label}>Estimated Days</label>
                  <input type="number" required placeholder="e.g. 3" style={s.input}
                    value={form.estimated_days} onChange={e => setForm({ ...form, estimated_days: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={s.label}>Cover Note</label>
                <textarea required rows={5} placeholder="Why are you the best fit for this task?" style={{ ...s.input, resize: 'none' }}
                  value={form.cover_note} onChange={e => setForm({ ...form, cover_note: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} style={{ background: 'var(--accent-blue-btn)', color: '#fff', border: 'none', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </form>
          </div>
        )}

        {!session && (
          <div style={{ ...s.card, textAlign: 'center', padding: '40px 24px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Login to apply for this task</p>
            <button onClick={() => router.push('/login')} style={{ background: 'var(--accent-blue-btn)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}