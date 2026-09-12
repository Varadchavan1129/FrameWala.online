/**
 * supabaseClient.js
 * FrameWala — Supabase connection setup (publishable/anon key only).
 *
 * The service_role key must NEVER be used or exposed here.
 *
 * Environment variables required in frontend/.env.local:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Guard: fail loudly at startup if credentials are missing.
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
// Never instantiate createClient() more than once.
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * testSupabaseConnection
 * Queries the `connection_test` table to verify a live Supabase connection.
 * Returns { success: boolean, message: string, data?: any }.
 * Never exposes credentials in error messages.
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('connection_test')
      .select('*');

    if (error) {
      // Surface the DB-level error message only (no keys, no URLs)
      return {
        success: false,
        message: `Supabase connection failed: ${error.message} (code: ${error.code})`,
      };
    }

    return {
      success: true,
      message: 'Supabase connected successfully.',
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: `Network error while connecting to Supabase: ${err.message}`,
    };
  }
}

