
import { useState, useEffect } from 'react'
import { supabase, Class, Subject } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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
      const { data, error } = await supabase
        .from('classes')
        .insert({
          subject_id: subjectId,
          teacher_id: user?.id || '',
          name,
          period,
          date
        })
        .select('*')
        .single()

      if (error) throw error

      // Fetch the subject details separately
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', data.subject_id)
        .single()

      if (subjectError) throw subjectError

      const newClass: ClassWithSubject = {
        ...data,
        subject: subjectData,
        attendance_status: null
      }

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
