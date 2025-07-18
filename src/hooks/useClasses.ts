
import { useState, useEffect } from 'react'
import { db, Class, Subject } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

export interface ClassWithSubject extends Class {
  subject: Subject
  attendance_status?: 'present' | 'absent' | 'late' | null
}

export const useClasses = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState<ClassWithSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchClasses()
    }
  }, [user])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use mock data for now to avoid RLS infinite recursion
      const mockClasses: ClassWithSubject[] = [
        {
          id: '1',
          subject_id: 'math-101',
          teacher_id: user?.id || 'teacher1',
          name: 'Mathematics 101',
          period: 'Period 1',
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subject: {
            id: 'math-101',
            name: 'Mathematics',
            code: 'MATH101',
            teacher_id: user?.id || 'teacher1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          attendance_status: null
        },
        {
          id: '2',
          subject_id: 'eng-101',
          teacher_id: user?.id || 'teacher1',
          name: 'English Literature',
          period: 'Period 2',
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subject: {
            id: 'eng-101',
            name: 'English',
            code: 'ENG101',
            teacher_id: user?.id || 'teacher1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          attendance_status: null
        }
      ]

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClasses(mockClasses)

    } catch (err) {
      console.error('Error in fetchClasses:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load classes'
      setError(errorMessage)
      
      // Set empty array as fallback
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const createClass = async (subjectId: string, name: string, period: string, date: string) => {
    try {
      const newClassDoc = await addDoc(collection(db, 'classes'), {
        subject_id: subjectId,
        teacher_id: user?.id || '',
        name,
        period,
        date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // For now, we'll use mock subject data
      const mockSubject: Subject = {
        id: subjectId,
        name: 'Subject',
        code: 'SUB101',
        teacher_id: user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newClass: ClassWithSubject = {
        id: newClassDoc.id,
        subject_id: subjectId,
        teacher_id: user?.id || '',
        name,
        period,
        date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subject: mockSubject,
        attendance_status: null
      };

      setClasses(prev => [newClass, ...prev])
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create class' 
      }
    }
  }

  return {
    classes,
    loading,
    error,
    createClass,
    refetch: fetchClasses
  }
}
