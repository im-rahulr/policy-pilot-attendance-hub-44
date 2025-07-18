
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, TrendingUp, AlertCircle, Calendar, BookOpen } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    attendanceRate: 0,
    pendingIssues: 0,
    totalSubjects: 0,
    activeClasses: 0,
    pendingNotifications: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Initialize with default values
      let totalUsers = 0
      let totalSubjects = 0
      let recentActivityData = []
      let attendanceRate = 0
      let activeToday = 0

      // Try to fetch users from Firebase
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        totalUsers = usersSnapshot.size || 1
      } catch (err) {
        console.warn('Users collection access failed:', err)
        totalUsers = 1
      }

      // Try to fetch subjects from Firebase
      try {
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'))
        totalSubjects = subjectsSnapshot.size || 5
      } catch (err) {
        console.warn('Subjects collection access failed:', err)
        totalSubjects = 5
      }

      // Try to fetch attendance records from Firebase
      try {
        const attendanceQuery = query(
          collection(db, 'attendance_records'),
          orderBy('created_at', 'desc'),
          limit(5)
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)
        
        if (attendanceSnapshot.empty) {
          recentActivityData = [
            { user: 'System', action: 'No attendance records yet', time: 'Just now' }
          ]
          attendanceRate = 100
        } else {
          const attendanceData = attendanceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          recentActivityData = attendanceData.map((record: any) => ({
            user: record.user_name || 'Unknown User',
            action: `Marked ${record.status || 'present'} for ${record.subject || 'a subject'}`,
            time: formatTimeAgo(new Date(record.created_at))
          }))

          // Calculate attendance rate
          const presentCount = attendanceData.filter((a: any) => a.status === 'present').length
          attendanceRate = Math.round((presentCount / attendanceData.length) * 100)
        }
      } catch (err) {
        console.warn('Attendance records collection access failed:', err)
        recentActivityData = [
          { user: 'System', action: 'Attendance system offline', time: 'Just now' }
        ]
        attendanceRate = 0
      }

      // Estimate active users
      activeToday = Math.floor(totalUsers * 0.75)

      setStats({
        totalUsers,
        activeToday,
        attendanceRate,
        pendingIssues: 0,
        totalSubjects,
        activeClasses: Math.min(totalSubjects, 5),
        pendingNotifications: 0
      });

      setRecentActivity(recentActivityData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      change: "+0%",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      title: "Active Today",
      value: stats.activeToday.toString(),
      change: "+0%",
      icon: UserCheck,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      change: "+0%",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      title: "Pending Issues",
      value: stats.pendingIssues.toString(),
      change: "0",
      icon: AlertCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-black border-gray-800">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-20 bg-slate-800 mb-2" />
                <Skeleton className="h-8 w-16 bg-slate-800 mb-2" />
                <Skeleton className="h-4 w-24 bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : stat.change === '0' ? 'text-gray-400' : 'text-red-400'}`}>
                      {stat.change !== '0' ? `${stat.change} from last week` : 'No change'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No recent activity available</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.user}</p>
                    <p className="text-gray-400 text-sm">{activity.action}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Total Subjects</span>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/50">
                {stats.totalSubjects}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Active Classes</span>
              <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/50">
                {stats.activeClasses}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Pending Notifications</span>
              <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-600/50">
                {stats.pendingNotifications}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">System Status</span>
              <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/50">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
