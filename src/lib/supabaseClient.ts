import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihbjcltiuhmjgcgmoulx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_sIjRBtxtVL831IIV7gAM_Q_1cqd_rwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
