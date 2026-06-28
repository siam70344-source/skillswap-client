'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/confirm-session?session_id=${session_id}`)
        .then(res => {
          if (res.data.success) setPayment(res.data.payment);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Confirming payment...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'var(--accent-green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
          ✓
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Your payment has been confirmed and the task is now in progress.</p>

        {payment && (
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
            {[
              { label: 'Task ID', value: payment.task_id?.slice(-8) },
              { label: 'Freelancer', value: payment.freelancer_email },
              { label: 'Amount Paid', value: `$${payment.amount}`, color: 'var(--accent-green)' },
              { label: 'Status', value: 'Completed' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.label}</span>
                <span style={{ color: item.color || 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => router.push('/dashboard/client')}
          style={{ background: 'var(--accent-blue-btn)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}