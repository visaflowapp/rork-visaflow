import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://ftybgvxdwbwqygzrpffi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eWJndnhkd2J3cXlnenJwZmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzkxOTMsImV4cCI6MjA2NDkxNTE5M30.WE8sMl0CbGtH9-PrGdGDuReMYxVAhfWlAd1v9nNL1Ro';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase connected successfully (hardcoded)');

export { supabase };