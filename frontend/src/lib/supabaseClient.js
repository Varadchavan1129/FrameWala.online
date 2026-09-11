/**
 * supabaseClient.js
 * FrameWala — Phase 1: Supabase connection setup.
 *
 * Uses the publishable (anon) key only.
 * The service_role key must NEVER be used here.
 *
 * Environment variables required in frontend/.env.local:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Guard: fail loudly at startup if credentials are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[FrameWala] Supabase configuration is missing.\n' +
    'Please ensure the following variables are set in frontend/.env.local:\n' +
    '  VITE_SUPABASE_URL\n' +
    '  VITE_SUPABASE_PUBLISHABLE_KEY\n' +
    'Do NOT use the service_role key here.'
  );
}

// Singleton Supabase client — import this wherever Supabase is needed.
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * testSupabaseConnection
 * Phase-1 connection test: pings the Supabase health endpoint.
 * Returns { success: boolean, message: string }.
 * Does not read or write any table data.
 */
export async function testSupabaseConnection() {
  try {
    // A lightweight query: fetch zero rows from a non-existent view
    // to confirm the client can reach Supabase without needing any table.
    const { error } = await supabase.from('_connection_test_').select('id').limit(0);

    // PGRST116 = "relation does not exist" — still means the server responded fine.
    if (!error || error.code === 'PGRST116' || error.code === '42P01') {
      return { success: true, message: 'Supabase connected successfully.' };
    }

    return { success: false, message: `Supabase error: ${error.message}` };
  } catch (err) {
    return { success: false, message: `Network error: ${err.message}` };
  }
}
