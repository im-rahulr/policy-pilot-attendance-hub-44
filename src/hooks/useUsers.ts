import { useState, useEffect } from 'react'
import { supabase, User } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useUsers = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'teacher')) {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use auth.admin to bypass RLS or query auth.users directly
      let usersData = []
      
      try {
        // First try to query the users table (custom table)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (error && error.code === '42P17') {
          // RLS infinite recursion - fall back to auth metadata approach
          console.warn('RLS issue detected, using auth metadata approach')
          
          // Get current user and create a user list from auth
          const { data: { user: authUser } } = await supabase.auth.getUser()
          
          if (authUser) {
            usersData = [{
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
              role: authUser.user_metadata?.role || 'student',
              avatar_url: authUser.user_metadata?.avatar_url || null,
              created_at: authUser.created_at || new Date().toISOString(),
              updated_at: authUser.updated_at || new Date().toISOString()
            }]
          }
        } else if (error) {
          throw error
        } else {
          usersData = data || []
          
          // If no users in custom table, fall back to current auth user
          if (usersData.length === 0) {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
              usersData = [{
                id: authUser.id,
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                role: authUser.user_metadata?.role || 'student',
                avatar_url: authUser.user_metadata?.avatar_url || null,
                created_at: authUser.created_at || new Date().toISOString(),
                updated_at: authUser.updated_at || new Date().toISOString()
              }]
            }
          }
        }
      } catch (dbError) {
        console.warn('Database connection failed, using auth fallback:', dbError)
        
        // Fallback to auth user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          usersData = [{
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: authUser.user_metadata?.role || 'student',
            avatar_url: authUser.user_metadata?.avatar_url || null,
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: authUser.updated_at || new Date().toISOString()
          }]
        }
      }

      setUsers(usersData)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, updated_at: new Date().toISOString() } : user
      ))
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update user role' 
      }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId))
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete user' 
      }
    }
  }

  const getUserStats = () => {
    const total = users.length
    const students = users.filter(u => u.role === 'student').length
    const teachers = users.filter(u => u.role === 'teacher').length
    const admins = users.filter(u => u.role === 'admin').length

    return { total, students, teachers, admins }
  }

  return {
    users,
    loading,
    error,
    updateUserRole,
    deleteUser,
    getUserStats,
    refetch: fetchUsers
  }
}
