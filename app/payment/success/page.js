'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function PaymentSuccessPage() {
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

  if (loading) return <div className="text-center py-20 text-gray-400">Confirming payment...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Your payment has been confirmed and the task is now in progress.</p>

        {payment && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Task ID</span>
              <span className="font-medium text-gray-800 text-sm font-mono">{payment.task_id?.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Freelancer</span>
              <span className="font-medium text-gray-800 text-sm">{payment.freelancer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="font-bold text-green-600">${payment.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Completed</span>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard/client')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}