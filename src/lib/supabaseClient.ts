import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhklrxirokafblslusvg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa2xyeGlyb2thZmJsc2x1c3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODI5NzQsImV4cCI6MjA4OTg1ODk3NH0.g_BUucs-_u7fVmiz5gm1ElsVlWYHCSwcdnhvkCfWG2o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
