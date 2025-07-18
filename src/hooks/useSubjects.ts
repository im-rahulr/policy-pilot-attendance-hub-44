import { useState, useEffect } from 'react'
import { db, Subject } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export interface SubjectWithTeacher {
  id: string
  name: string
  code: string
  description?: string
  teacher_id: string
  created_at: string
  updated_at: string
  teacher?: {
    id: string
    full_name: string
    email: string
  }
}

export const useSubjects = () => {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<SubjectWithTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchSubjects()
    }
  }, [user])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Enhanced mock data that looks more realistic
      const mockSubjects: SubjectWithTeacher[] = [
        {
          id: 'math-101',
          name: 'Mathematics',
          code: 'MATH101',
          description: 'Algebra and Geometry fundamentals',
          teacher_id: 'teacher1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher: {
            id: 'teacher1',
            full_name: 'Dr. Sarah Wilson',
            email: 'sarah.wilson@school.edu'
          }
        },
        {
          id: 'eng-101',
          name: 'English Literature',
          code: 'ENG101',
          description: 'Classic and modern literature analysis',
          teacher_id: 'teacher2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher: {
            id: 'teacher2',
            full_name: 'Prof. James Brown',
            email: 'james.brown@school.edu'
          }
        },
        {
          id: 'sci-101',
          name: 'Physics',
          code: 'PHY101',
          description: 'Fundamental principles of physics',
          teacher_id: 'teacher3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher: {
            id: 'teacher3',
            full_name: 'Dr. Michael Chen',
            email: 'michael.chen@school.edu'
          }
        },
        {
          id: 'chem-101',
          name: 'Chemistry',
          code: 'CHEM101',
          description: 'Organic and inorganic chemistry basics',
          teacher_id: 'teacher4',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher: {
            id: 'teacher4',
            full_name: 'Dr. Lisa Garcia',
            email: 'lisa.garcia@school.edu'
          }
        },
        {
          id: 'hist-101',
          name: 'World History',
          code: 'HIST101',
          description: 'Ancient to modern world civilizations',
          teacher_id: 'teacher5',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          teacher: {
            id: 'teacher5',
            full_name: 'Prof. Robert Taylor',
            email: 'robert.taylor@school.edu'
          }
        }
      ]

      setSubjects(mockSubjects)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (subjectData: {
    name: string
    code: string
    description?: string
    teacher_id?: string
  }) => {
    try {
      // Simulate creating new subject
      const newSubject: SubjectWithTeacher = {
        id: `subject-${Date.now()}`,
        name: subjectData.name,
        code: subjectData.code,
        description: subjectData.description,
        teacher_id: subjectData.teacher_id || user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        teacher: {
          id: subjectData.teacher_id || user?.id || '',
          full_name: user?.full_name || 'Current User',
          email: user?.email || 'user@school.edu'
        }
      }
      
      setSubjects(prev => [newSubject, ...prev])
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create subject' 
      }
    }
  }

  const updateSubject = async (subjectId: string, subjectData: {
    name?: string
    code?: string
    description?: string
    teacher_id?: string
  }) => {
    try {
      // Simulate successful update
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, ...subjectData, updated_at: new Date().toISOString() }
          : subject
      ))
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update subject' 
      }
    }
  }

  const deleteSubject = async (subjectId: string) => {
    try {
      // Simulate successful deletion
      setSubjects(prev => prev.filter(subject => subject.id !== subjectId))
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete subject' 
      }
    }
  }

  return {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects
  }
}
