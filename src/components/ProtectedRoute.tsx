import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'teacher' | 'admin'
  requireSpecificAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requireSpecificAdmin = false }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireSpecificAdmin && user.email !== 'rahul11222233@gmail.com') {
    console.log('Admin check failed:', { userEmail: user.email, expectedEmail: 'rahul11222233@gmail.com' });
    // User is not the specific admin
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this page.</p>
          <p className="text-xs text-gray-500 mt-2">Current user: {user.email}</p>
        </div>
      </div>
    )
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    // User doesn't have required role
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
