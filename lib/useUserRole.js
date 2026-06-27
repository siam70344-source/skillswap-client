'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';

/**
 * Shared hook to resolve the logged-in user's role.
 *
 * Why this exists:
 * BetterAuth's session object does NOT include custom fields like `role`
 * by default — `session.user.role` is always undefined. The role lives in
 * your own `users` collection and has to be fetched separately via
 * `/users/:email`. Previously this fetch was duplicated in Navbar AND in
 * each dashboard page, each with its own loading state. That created a
 * race: a dashboard page would check `session.user?.role !== 'client'`
 * before its own role fetch resolved, see `undefined !== 'client'`, and
 * redirect home — even for the correct role.
 *
 * This hook centralizes that fetch so every page reads from one place and
 * everyone can wait on the same `roleLoading` flag before making
 * redirect decisions.
 *
 * Returns: { role, roleLoading }
 *   role: 'client' | 'freelancer' | 'admin' | null
 *   roleLoading: true until the role fetch has settled (success or fail)
 */
export function useUserRole() {
  const { data: session, isPending } = useSession();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Still waiting on session itself — keep roleLoading true.
    if (isPending) return;

    // No session at all — nothing to fetch, role stays null, not loading.
    if (!session?.user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    let cancelled = false;
    setRoleLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.email}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setRole(data?.role || null);
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      })
      .finally(() => {
        if (!cancelled) setRoleLoading(false);
      });

    return () => { cancelled = true; };
  }, [session, isPending]);

  return { role, roleLoading, session, isPending };
}