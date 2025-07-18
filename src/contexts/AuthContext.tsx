
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth, createUser, signInUser, signOutUser, resetUserPassword, getUserProfile, User } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
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
  const [loading, setLoading] = useState(true)

  console.log('AuthProvider state:', { user: !!user, loading });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state change:', !!firebaseUser)
      
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          // If no profile exists, create a basic one
          if (!userProfile) {
            // Special admin override for specific email
            const userRole = firebaseUser.email === 'rahul11222233@gmail.com' ? 'admin' : 'student';
            
            userProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: userRole,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          } else {
            // Special admin override for specific email
            if (firebaseUser.email === 'rahul11222233@gmail.com') {
              userProfile.role = 'admin';
            }
          }
          
          console.log('Setting user:', userProfile)
          setUser(userProfile)
        } catch (error) {
          console.error('Error getting user profile:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    });

    return () => unsubscribe();
  }, [])

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student') => {
    try {
      console.log('Sign up attempt:', { email, fullName, role })
      
      await createUser(email, password, fullName, role)
      
      console.log('Sign up successful')
      return { error: null, success: true }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { error: { message: error.message }, success: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email)
      
      await signInUser(email, password)
      
      console.log('Sign in successful')
      return { error: null, success: true }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { error: { message: error.message }, success: false }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out')
      await signOutUser()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('Reset password for:', email)
      await resetUserPassword(email)
      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error }
    }
  }

  const value = {
    user,
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
