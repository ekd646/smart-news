import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihbjcltiuhmjgcgmoulx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYmpjbHRpdWhtamdjZ21vdWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODMxMTksImV4cCI6MjA4OTg1OTExOX0.KtQ0tOTFUtUkGBiIIVysw9ViwZl6KSarxb0LK1m0vQ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
