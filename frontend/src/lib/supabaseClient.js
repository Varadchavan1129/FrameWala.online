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

// Instantiate Supabase client only if credentials are provided in env
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * testSupabaseConnection
 * Queries the `connection_test` table to verify a live Supabase connection.
 * Returns { success: boolean, message: string, data?: any }.
 * Never exposes credentials in error messages.
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials not configured.',
    };
  }
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

