
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Report from "./Report";
import Profile from "./Profile";
import AdminPanel from "./AdminPanel";
import Notifications from "./Notifications";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index component - Auth state:', { user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes - accessible when not authenticated */}
      <Route path="/auth/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/auth/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/auth/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />

      {/* Protected routes - require authentication */}
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <Dashboard />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/report" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <Report />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <Profile />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/notifications" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <Notifications />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <AdminPanel />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/admin-control/*" element={
        <ProtectedRoute requireSpecificAdmin={true}>
          <div className="min-h-screen bg-black">
            <div className="pb-20">
              <AdminPanel />
            </div>
            <Navigation />
          </div>
        </ProtectedRoute>
      } />

      {/* Redirect unauthenticated users to login */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />} />
    </Routes>
  );
};

export default Index;
