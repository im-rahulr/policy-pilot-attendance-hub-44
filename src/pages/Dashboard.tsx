import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClasses } from "@/hooks/useClasses";
import { useAttendance } from "@/hooks/useAttendance";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    classes,
    loading: classesLoading,
    error: classesError
  } = useClasses();
  const {
    markAttendance,
    getAttendanceStats,
    loading: attendanceLoading
  } = useAttendance();
  const [markingAttendance, setMarkingAttendance] = useState<string | null>(null);
  const handleMarkAttendance = async (classId: string, status: 'present' | 'absent' | 'late') => {
    setMarkingAttendance(classId);
    try {
      const result = await markAttendance(classId, status);
      if (!result.success) {
        console.error('Failed to mark attendance:', result.error);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setMarkingAttendance(null);
    }
  };
  const attendanceStats = getAttendanceStats();
  if (classesLoading || attendanceLoading) {
    return <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <Skeleton className="h-8 w-48 bg-slate-800" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 bg-slate-800" />
            {[1, 2, 3].map(i => <Card key={i} className="bg-black border-gray-800">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 bg-slate-800 mb-4" />
                  <Skeleton className="h-4 w-full bg-slate-800 mb-2" />
                  <Skeleton className="h-10 w-full bg-slate-800" />
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
  if (classesError) {
    return <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Failed to load classes: {String(classesError)}
            </AlertDescription>
          </Alert>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hello, {user?.full_name || 'User'}!</h1>
            <p className="text-gray-400">Welcome back to your dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Overall Attendance</p>
            <p className="text-2xl font-bold text-white">{attendanceStats?.percentage || 0}%</p>
            <p className="text-xs text-gray-500">
              {attendanceStats?.present || 0}/{attendanceStats?.total || 0} classes
            </p>
          </div>
        </div>

        {/* Today's Classes Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Today's Classes</h2>
          
          {classes.length === 0 ? <Card className="bg-black border-gray-800">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No classes scheduled for today</p>
              </CardContent>
            </Card> : classes.map(classItem => <Card key={classItem.id} className="bg-black border-gray-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {classItem.subject?.name || 'Unknown Subject'}
                      </h3>
                      <p className="text-sm text-gray-400">{classItem.name || 'Unnamed Class'}</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {classItem.period || 'N/A'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400">Status: </span>
                      {classItem.attendance_status ? <Badge variant={classItem.attendance_status === 'present' ? 'default' : 'destructive'} className={classItem.attendance_status === 'present' ? 'bg-green-600' : 'bg-red-600'}>
                          {classItem.attendance_status === 'present' ? 'Present' : classItem.attendance_status === 'absent' ? 'Absent' : 'Late'}
                        </Badge> : <span className="text-orange-400 text-sm font-medium">
                          Mark your attendance
                        </span>}
                    </div>

                    {!classItem.attendance_status && <div className="flex space-x-3 pt-2">
                        <Button onClick={() => handleMarkAttendance(classItem.id, 'present')} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={markingAttendance === classItem.id}>
                          {markingAttendance === classItem.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                          Present
                        </Button>
                        <Button onClick={() => handleMarkAttendance(classItem.id, 'absent')} variant="destructive" className="flex-1" disabled={markingAttendance === classItem.id}>
                          {markingAttendance === classItem.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                          Absent
                        </Button>
                        
                      </div>}
                  </div>
                </CardContent>
              </Card>)}
        </div>
      </div>
    </div>;
};
export default Dashboard;