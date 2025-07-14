import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase config:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'present' : 'missing' });

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey });
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'admin'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  teacher_id: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  subject_id: string
  teacher_id: string
  name: string
  period: string
  date: string
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  class_id: string
  status: 'present' | 'absent' | 'late'
  marked_at: string
  marked_by: string
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  subjects?: Subject[]
  attendance_rate?: number
  total_classes?: number
}
