import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Settings, LogOut, AlertCircle, Loader2, Calendar, BookOpen, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/hooks/useAttendance";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { getAttendanceStats } = useAttendance();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement profile update API call
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        throw error;
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setIsChangingPassword(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const attendanceStats = getAttendanceStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48 bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
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

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Personal Information</CardTitle>
                <Button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.full_name}</h3>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={isEditing ? profileData.full_name : user.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled={true}
                      className="pl-10 bg-gray-900 border-gray-700 text-white opacity-60"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-300">Role</Label>
                  <Input
                    id="role"
                    value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    disabled={true}
                    className="bg-gray-900 border-gray-700 text-white opacity-60"
                  />
                </div>

                <div>
                  <Label htmlFor="joined" className="text-gray-300">Member Since</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="joined"
                      value={new Date(user.created_at).toLocaleDateString()}
                      disabled={true}
                      className="pl-10 bg-gray-900 border-gray-700 text-white opacity-60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {attendanceStats.percentage}%
                </div>
                <p className="text-gray-400">Overall Attendance</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">
                    {attendanceStats.present}
                  </div>
                  <p className="text-xs text-gray-400">Present</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-400">
                    {attendanceStats.absent}
                  </div>
                  <p className="text-xs text-gray-400">Absent</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {attendanceStats.late}
                  </div>
                  <p className="text-xs text-gray-400">Late</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Classes</span>
                  <span className="text-white font-semibold">{attendanceStats.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${attendanceStats.percentage}%` }}
                  />
                </div>
              </div>

              {attendanceStats.percentage < 75 && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    Your attendance is below 75%. Consider attending more classes to improve your percentage.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
                <Button 
                  onClick={() => setIsChangingPassword(!isChangingPassword)} 
                  variant="outline" 
                  size="sm"
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isChangingPassword ? 'Cancel' : 'Change'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <div className="text-center py-6">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Click "Change" to update your password</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white"
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Update Password
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
