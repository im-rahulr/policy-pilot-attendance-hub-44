import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/hooks/useAttendance";

const Report = () => {
  const { user } = useAuth();
  const { attendance, loading, error, getAttendanceStats } = useAttendance();

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48 bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-black border-gray-800">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 bg-slate-800 mb-4" />
                  <Skeleton className="h-32 w-full bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto">
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Failed to load attendance data: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const attendanceStats = getAttendanceStats();
  
  const totalAttendanceData = [
    {
      name: 'Present',
      value: attendanceStats.present,
      color: '#10b981'
    },
    {
      name: 'Absent',
      value: attendanceStats.absent,
      color: '#ef4444'
    },
    {
      name: 'Late',
      value: attendanceStats.late,
      color: '#f59e0b'
    }
  ].filter(item => item.value > 0);

  // Group attendance by subject
  const subjectStats = attendance.reduce((acc: any, record) => {
    const subjectName = record.class?.subject?.name || 'Unknown';
    if (!acc[subjectName]) {
      acc[subjectName] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    acc[subjectName][record.status]++;
    acc[subjectName].total++;
    return acc;
  }, {});

  const subjectData = Object.entries(subjectStats).map(([subject, stats]: [string, any]) => {
    const percentage = Math.round((stats.present / stats.total) * 100);
    let status = 'excellent';
    let message = `Great attendance! You can miss ${Math.floor((stats.total * 0.25))} more classes and still maintain 75%.`;
    
    if (percentage < 75) {
      const needed = Math.ceil((0.75 * (stats.total + 10)) - stats.present);
      status = percentage < 50 ? 'critical' : 'warning';
      message = `You need to attend ${needed} more classes to reach 75%.`;
    }

    return {
      subject,
      present: stats.present,
      absent: stats.absent,
      late: stats.late,
      percentage,
      status,
      message
    };
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Attendance Report</h1>
          <p className="text-gray-400">Track your attendance performance across all subjects</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Attendance Chart */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-white">{attendanceStats.percentage}%</p>
                  <p className="text-sm text-gray-400">
                    {attendanceStats.present} out of {attendanceStats.total} classes
                  </p>
                </div>
                <div className="h-24 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={totalAttendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        dataKey="value"
                      >
                        {totalAttendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-2">
                {totalAttendanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance Chart */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="subject" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Subject-wise Analysis</h2>
          
          {subjectData.length === 0 ? (
            <Card className="bg-black border-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No attendance data available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectData.map((subject, index) => (
                <Card key={index} className="bg-black border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{subject.subject}</h3>
                      {getStatusIcon(subject.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Attendance Rate</span>
                        <Badge className={getStatusColor(subject.status)}>
                          {subject.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-semibold">{subject.present}</p>
                          <p className="text-gray-500">Present</p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-400 font-semibold">{subject.absent}</p>
                          <p className="text-gray-500">Absent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-yellow-400 font-semibold">{subject.late}</p>
                          <p className="text-gray-500">Late</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{subject.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
