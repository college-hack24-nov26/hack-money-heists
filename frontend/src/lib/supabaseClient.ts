import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://mmljatcvouyjfbznxjgs.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mt-NaU29NLLqSThp1Eym0A_BBs1NWo7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
