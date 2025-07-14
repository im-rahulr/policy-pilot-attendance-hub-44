
import { useState, useEffect } from 'react'
import { supabase, AttendanceRecord, Class, Subject } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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

      // Try to fetch attendance records with better error handling
      try {
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance_records')
          .select(`
            *,
            classes!inner(
              *,
              subjects!inner(*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (attendanceError) {
          if (attendanceError.code === '42P01') {
            // Table doesn't exist - provide helpful message
            setError('Attendance system not set up yet. Please contact your administrator.')
            setAttendance([])
            return
          } else if (attendanceError.code === '42P17') {
            // RLS issue - provide helpful message  
            setError('Database access restricted. Please contact your administrator.')
            setAttendance([])
            return
          }
          throw attendanceError
        }

        // Transform the data to match our interface
        const transformedData: AttendanceWithDetails[] = (attendanceData || []).map(record => ({
          ...record,
          class: {
            ...record.classes,
            subject: record.classes.subjects
          }
        }))

        setAttendance(transformedData || [])

      } catch (err) {
        console.error('Error fetching attendance:', err)
        
        // Provide user-friendly error messages
        if (err instanceof Error) {
          if (err.message.includes('attendance_records')) {
            setError('Attendance records table not found. Please contact your administrator.')
          } else if (err.message.includes('permission')) {
            setError('You do not have permission to view attendance records.')
          } else {
            setError('Unable to load attendance data. Please try again later.')
          }
        } else {
          setError('Failed to load attendance data')
        }
        
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
      // Insert attendance record into Supabase
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: user?.id,
          class_id: classId,
          status,
          marked_by: user?.id,
          marked_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) throw error

      // Fetch the class and subject details separately
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single()

      if (classError) throw classError

      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', classData.subject_id)
        .single()

      if (subjectError) throw subjectError

      const newAttendanceRecord: AttendanceWithDetails = {
        ...data,
        class: {
          ...classData,
          subject: subjectData
        }
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
