
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, role?: 'student' | 'teacher') => Promise<{ error: any; success?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: any; success?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('AuthProvider state:', { user: !!user, session: !!session, loading });

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return;

        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }

        console.log('Session result:', !!session)
        setSession(session)
        
        if (session?.user) {
          // Special admin override for specific email
          const userRole = session.user.email === 'rahul11222233@gmail.com' 
            ? 'admin' 
            : (session.user.user_metadata?.role || 'student');
            
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: userRole,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          console.log('Setting user:', userData)
          setUser(userData)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session)
      
      if (!isMounted) return;

      setSession(session)
      
      if (session?.user) {
        // Special admin override for specific email
        const userRole = session.user.email === 'rahul11222233@gmail.com' 
          ? 'admin' 
          : (session.user.user_metadata?.role || 'student');
          
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: userRole,
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      isMounted = false;
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student') => {
    try {
      console.log('Sign up attempt:', { email, fullName, role })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      })
      
      console.log('Sign up result:', { data: !!data, error: error?.message })
      
      if (error) {
        return { error, success: false }
      }

      return { error: null, success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error, success: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('Sign in result:', { data: !!data, error: error?.message })
      
      if (error) {
        return { error, success: false }
      }

      return { error: null, success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error, success: false }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out')
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('Reset password for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
