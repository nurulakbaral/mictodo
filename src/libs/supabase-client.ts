import { createClient } from '@supabase/supabase-js'

type Secret = string | undefined
const supabaseUrl: Secret = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey: Secret = process.env.NEXT_PUBLIC_SUPABASE_API_KEYS
export const supabaseClient = createClient(supabaseUrl as string, supabaseAnonKey as string)
