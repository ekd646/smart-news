import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhklrxirokafblslusvg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zIYEX5EmuIhjkCBRGjj3qg_F6i-fcZv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
