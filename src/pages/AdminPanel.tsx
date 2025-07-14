
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, FileDown, BookOpen, Calendar, Bell, AlertTriangle, BarChart3, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import SubjectManagement from "@/components/admin/SubjectManagement";
import ManualAttendance from "@/components/admin/ManualAttendance";
import NotificationCenter from "@/components/admin/NotificationCenter";
import ErrorTracking from "@/components/admin/ErrorTracking";
import DataExport from "@/components/admin/DataExport";
import DataManagement from "@/components/admin/DataManagement";
import ScheduleManagement from "@/components/admin/ScheduleManagement";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { path: "/admin/dashboard", icon: BarChart3, label: "Dashboard", color: "text-blue-400" },
    { path: "/admin/users", icon: Users, label: "User Management", color: "text-green-400" },
    { path: "/admin/subjects", icon: BookOpen, label: "Subject Management", color: "text-purple-400" },
    { path: "/admin/schedule", icon: Calendar, label: "Class Schedule", color: "text-orange-400" },
    { path: "/admin/attendance", icon: Calendar, label: "Manual Attendance", color: "text-yellow-400" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications", color: "text-teal-400" },
    { path: "/admin/export", icon: FileDown, label: "Data Export", color: "text-pink-400" },
    { path: "/admin/data", icon: Database, label: "Data Management", color: "text-cyan-400" },
    { path: "/admin/errors", icon: AlertTriangle, label: "Error Tracking", color: "text-red-400" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400">Manage your attendance system</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/50">
            Administrator
          </Badge>
        </div>

        {/* Quick Actions Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4 mb-8">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Card 
                key={item.path} 
                className={`bg-black border-gray-800 hover:bg-gray-900 transition-colors cursor-pointer ${
                  isActive ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <p className="text-sm font-medium text-white">{item.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Routes */}
        <div className="bg-black min-h-[500px]">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/subjects" element={<SubjectManagement />} />
            <Route path="/schedule" element={<ScheduleManagement />} />
            <Route path="/attendance" element={<ManualAttendance />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/export" element={<DataExport />} />
            <Route path="/data" element={<DataManagement />} />
            <Route path="/errors" element={<ErrorTracking />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
