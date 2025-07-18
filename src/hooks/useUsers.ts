import { useState, useEffect } from 'react'
import { db, User } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore'

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

      // Fetch users from Firebase
      let usersData = []
      
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('created_at', 'desc'))
        const usersSnapshot = await getDocs(usersQuery)
        
        usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User))

        // If no users found, include current user
        if (usersData.length === 0 && user) {
          usersData = [user]
        }
      } catch (dbError) {
        console.warn('Database connection failed, using current user:', dbError)
        
        // Fallback to current user
        if (user) {
          usersData = [user]
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
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { 
        role: newRole, 
        updated_at: new Date().toISOString() 
      })

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
      const userRef = doc(db, 'users', userId)
      await deleteDoc(userRef)

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
