import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjfnxlpfkqnhbiqhpksl.supabase.co'
const supabaseAnonKey = 'sb_publishable_-ew5IQjLbUVXTTmR-OcGqw_5AgBFtcB'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
