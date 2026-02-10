import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xgfsnvzduhnroslmgoqu.supabase.co';
const supabaseAnonKey = 'sb_publishable_iJA0MG3RFY6cQTundp8gJQ_jzbHE0JT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
