import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jztmuskbsjvcayksxojt.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_ittsq3gcRmfO-jP8USOobw_1FxiClJV';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ittsq3gcRmfO-jP8USOobw_1FxiClJV';
const supabaseKey =
  supabasePublishableKey || supabaseAnonKey || import.meta.env.VITE_SUPABASE_KEY;

export const supabaseEnvStatus = {
  supabaseUrl: Boolean(supabaseUrl),
  supabasePublishableKey: Boolean(supabasePublishableKey),
  supabaseAnonKey: Boolean(supabaseAnonKey),
  supabaseKey: Boolean(supabaseKey),
  keySource: supabasePublishableKey
    ? "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
    : supabaseAnonKey
    ? "VITE_SUPABASE_ANON_KEY"
    : import.meta.env.VITE_SUPABASE_KEY
    ? "VITE_SUPABASE_KEY"
    : "HARDCODED_FALLBACK",
  usingFallback: !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (import.meta.env.DEV) {
  console.debug("Supabase env status:", supabaseEnvStatus);
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
