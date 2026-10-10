/**
 * SupabaseStatus.jsx
 * FrameWala — Integration status indicator.
 *
 * Runs the connection_test table query once on mount and displays
 * a small success / error badge. Visible only in development mode
 * (import.meta.env.DEV) so it never appears in production builds.
 *
 * Usage: import and render anywhere, e.g. bottom of Home.jsx.
 * Does NOT modify any existing component logic or design.
 */

import React, { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../../lib/supabaseClient.js';

const SupabaseStatus = () => {
  const [status, setStatus] = useState({ done: false, success: null, message: '' });

  useEffect(() => {
    let cancelled = false;
    testSupabaseConnection().then((result) => {
      if (!cancelled) {
        setStatus({ done: true, success: result.success, message: result.message });
        // Always log to browser console for Varad's inspection
        if (result.success) {
          console.info('[FrameWala] ✅ Supabase:', result.message, result.data ?? '');
        } else {
          console.error('[FrameWala] ❌ Supabase:', result.message);
        }
      }
    });
    return () => { cancelled = true; };
  }, []);

  // Hide completely in production builds
  if (!import.meta.env.DEV) return null;
  if (!status.done) return null;

  const base =
    'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg border backdrop-blur-sm select-none';
  const ok = 'bg-green-50/90 border-green-300 text-green-800';
  const fail = 'bg-red-50/90 border-red-300 text-red-800';

  return (
    <div className={`${base} ${status.success ? ok : fail}`} role="status" aria-live="polite">
      <span className="text-base leading-none">{status.success ? '✅' : '❌'}</span>
      <span>{status.message}</span>
    </div>
  );
};

export default SupabaseStatus;
