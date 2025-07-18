
import { useState, useEffect } from 'react'
import { db, AttendanceRecord, Class, Subject } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'

export interface AttendanceWithDetails extends AttendanceRecord {
  class: Class & {
    subject: Subject
  }
}

export const useAttendance = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState<AttendanceWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAttendance()
    }
  }, [user])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.id) {
        setAttendance([])
        return
      }

      // Try to fetch attendance records from Firebase
      try {
        const attendanceQuery = query(
          collection(db, 'attendance_records'),
          where('user_id', '==', user.id),
          orderBy('created_at', 'desc')
        )
        
        const attendanceSnapshot = await getDocs(attendanceQuery)
        
        if (attendanceSnapshot.empty) {
          setAttendance([])
          return
        }

        // For now, use mock class and subject data since we don't have complex joins in Firestore
        const mockClassData = {
          id: 'class-1',
          subject_id: 'subject-1',
          teacher_id: 'teacher-1',
          name: 'Sample Class',
          period: 'Period 1',
          date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subject: {
            id: 'subject-1',
            name: 'Sample Subject',
            code: 'SUB101',
            teacher_id: 'teacher-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }

        const transformedData: AttendanceWithDetails[] = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          class: mockClassData
        } as AttendanceWithDetails))

        setAttendance(transformedData)

      } catch (err) {
        console.error('Error fetching attendance:', err)
        setError('Unable to load attendance data. Please try again later.')
        setAttendance([])
      }

    } catch (err) {
      console.error('Error in fetchAttendance:', err)
      setError('System error occurred. Please contact support.')
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (classId: string, status: 'present' | 'absent' | 'late') => {
    try {
      // Insert attendance record into Firebase
      const attendanceData = {
        user_id: user?.id,
        class_id: classId,
        status,
        marked_by: user?.id,
        marked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'attendance_records'), attendanceData)

      // Use mock class data for now
      const mockClassData = {
        id: classId,
        subject_id: 'subject-1',
        teacher_id: 'teacher-1',
        name: 'Sample Class',
        period: 'Period 1',
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subject: {
          id: 'subject-1',
          name: 'Sample Subject',
          code: 'SUB101',
          teacher_id: 'teacher-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      const newAttendanceRecord: AttendanceWithDetails = {
        id: docRef.id,
        ...attendanceData,
        class: mockClassData
      }

      setAttendance(prev => [newAttendanceRecord, ...prev])
      return { success: true }
    } catch (err) {
      console.error('Error in markAttendance:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to mark attendance' 
      }
    }
  }

  const getAttendanceStats = () => {
    if (!Array.isArray(attendance)) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 }
    }

    const total = attendance.length
    const present = attendance.filter(a => a?.status === 'present').length
    const absent = attendance.filter(a => a?.status === 'absent').length
    const late = attendance.filter(a => a?.status === 'late').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { total, present, absent, late, percentage }
  }

  return {
    attendance,
    loading,
    error,
    markAttendance,
    getAttendanceStats,
    refetch: fetchAttendance
  }
}
