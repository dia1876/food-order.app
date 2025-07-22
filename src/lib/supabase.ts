// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gzaeazxodfkyzxvophug.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YWVhenhvZGZreXp4dm9waHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjkxMjAsImV4cCI6MjA2NzgwNTEyMH0.gjRb3YIlWzVCB1H7epBuoxQpTYiQ3lYjxUfk7dm7dkc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


