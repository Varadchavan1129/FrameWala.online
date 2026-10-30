// frontend/api/supabase.js
// Server-side Supabase client for Vercel Serverless Functions

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Vercel Serverless] Supabase credentials not found in environment variables.');
}

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export const isSupabaseConfigured = () => Boolean(supabase);

export const getSupabaseMeta = () => {
  let role = 'unknown';
  try {
    if (supabaseKey && supabaseKey.includes('.')) {
      const parts = supabaseKey.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        role = payload.role || 'no-role-field';
      }
    } else if (supabaseKey && supabaseKey.startsWith('sb_publishable_')) {
      role = 'anon-publishable-key';
    }
  } catch (e) {
    role = `decode-error: ${e.message}`;
  }
  return {
    urlHost: supabaseUrl ? new URL(supabaseUrl).host : 'missing',
    keyRole: role,
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) : 'none',
    anonKeyPrefix: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 10) : 'none',
  };
};
