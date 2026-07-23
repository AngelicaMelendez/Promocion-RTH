// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://feylqcbnbndaefshhrpv.supabase.co'
const supabaseAnonKey = 'sb_publishable_RAlV0OCSUQNvEhmZam1cwA_3aViGAzg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)