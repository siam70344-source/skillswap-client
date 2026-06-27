'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function BrowseTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        params: { search, category, page, limit: 9 }
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [search, category, page]);

  const categories = ['Design', 'Writing', 'Development', 'Marketing', 'Other'];

  const categoryStyle = {
    Design: { bg: 'var(--accent-purple-bg)', color: 'var(--accent-purple)' },
    Writing: { bg: 'var(--accent-blue-bg)', color: 'var(--accent-blue)' },
    Development: { bg: 'var(--accent-green-bg)', color: 'var(--accent-green)' },
    Marketing: { bg: 'var(--accent-amber-bg)', color: 'var(--accent-amber)' },
    Other: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 32px' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Browse Tasks</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Find the perfect task that matches your skills</p>
          </div>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search tasks by title..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: 40, background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px 10px 40px', width: '100%' }} />
            </div>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
              style={{ minWidth: 160, background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px' }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => { setCategory(''); setPage(1); }}
              style={{ padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: !category ? 'var(--accent-blue-btn)' : 'var(--bg-tertiary)', color: !category ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              All
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }}
                style={{ padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: category === c ? 'var(--accent-blue-btn)' : 'var(--bg-tertiary)', color: category === c ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {!loading && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
            {total} task{total !== 1 ? 's' : ''} found{category ? ` in ${category}` : ''}{search ? ` for "${search}"` : ''}
          </p>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, animation: 'pulse 1.5s infinite' }}>
                <div style={{ height: 16, background: 'var(--bg-tertiary)', borderRadius: 6, width: '30%', marginBottom: 16 }} />
                <div style={{ height: 20, background: 'var(--bg-tertiary)', borderRadius: 6, width: '70%', marginBottom: 12 }} />
                <div style={{ height: 14, background: 'var(--bg-tertiary)', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 14, background: 'var(--bg-tertiary)', borderRadius: 6, width: '60%' }} />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No tasks found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {tasks.map(task => {
              const cs = categoryStyle[task.category] || categoryStyle.Other;
              return (
                <Link href={`/browse-tasks/${task._id}`} key={task._id} style={{ textDecoration: 'none' }}>
                  <div className="task-card" style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex',
                    flexDirection: 'column', transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ padding: '20px 20px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ background: cs.bg, color: cs.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {task.category}
                        </span>
                        <span style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          Open
                        </span>
                      </div>
                      <h3 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>
                        {task.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 16,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </p>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: 20 }}>${task.budget}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>📅 {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>👤 {task.client_email}</span>
                        <span style={{ color: 'var(--accent-blue)', fontSize: 12, fontWeight: 500 }}>View Details →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
              ← Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  background: page === i + 1 ? 'var(--accent-blue-btn)' : 'var(--bg-secondary)',
                  color: page === i + 1 ? '#fff' : 'var(--text-secondary)',
                  borderColor: page === i + 1 ? 'var(--accent-blue-btn)' : 'var(--border-default)' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}