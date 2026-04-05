import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (import.meta.env.DEV) {
  console.debug("Supabase env status:", {
    supabaseUrl: Boolean(supabaseUrl),
    supabaseKey: Boolean(supabaseKey),
    keySource: import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
      ? "PUBLISHABLE_DEFAULT_KEY"
      : import.meta.env.VITE_SUPABASE_ANON_KEY
      ? "ANON_KEY"
      : import.meta.env.VITE_SUPABASE_KEY
      ? "KEY"
      : "none",
  });
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
