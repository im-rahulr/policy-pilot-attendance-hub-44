import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    signIn,
    signUp,
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  console.log('Login component - Auth state:', {
    user: !!user,
    loading
  });

  // Redirect if already authenticated - simplified
  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting...');
      navigate("/dashboard", {
        replace: true
      });
    }
  }, [user, loading, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError("Full name is required");
          return;
        }
        console.log('Attempting sign up...');
        const {
          error,
          success
        } = await signUp(email, password, fullName);
        if (error) {
          console.error('Sign up error:', error);
          setError(error?.message || "Sign up failed");
        } else if (success) {
          console.log('Sign up successful');
          setSuccess("Account created successfully! You can now sign in.");
          // Switch to sign in mode
          setIsSignUp(false);
          setFullName("");
        }
      } else {
        console.log('Attempting sign in...');
        const {
          error,
          success
        } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          setError(error?.message || "Invalid email or password");
        } else if (success) {
          console.log('Sign in successful - will redirect via useEffect');
          setSuccess("Sign in successful!");
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const switchMode = (newMode: boolean) => {
    setIsSignUp(newMode);
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  // Only show loading during initial auth check, not for form submissions
  if (loading && !error && !success && !isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Initializing...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to <span className="italic text-3xl">LowryBunks</span>
          </h1>
          <p className="text-gray-300">Access your attendance portal</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex mb-6 bg-gray-800 rounded-full p-1">
          <button onClick={() => switchMode(false)} className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${!isSignUp ? 'bg-green-400 text-gray-900' : 'text-gray-400 hover:text-gray-200'}`} disabled={isLoading}>
            Login
          </button>
          <button onClick={() => switchMode(true)} className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${isSignUp ? 'bg-green-400 text-gray-900' : 'text-gray-400 hover:text-gray-200'}`} disabled={isLoading}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>}

          {success && <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {success}
              </AlertDescription>
            </Alert>}

          {/* Full Name - Only for Sign Up */}
          {isSignUp && <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <Input type="text" placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} required={isSignUp} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder:text-gray-400" disabled={isLoading} />
            </div>}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder:text-gray-400" disabled={isLoading} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder:text-gray-400" disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200" disabled={isLoading}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me / Forgot Password - Only for Login */}
          {!isSignUp && <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded border-gray-600 bg-gray-800 text-green-400 focus:ring-green-400" disabled={isLoading} />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors" disabled={isLoading}>
            {isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing in...'}
              </> : isSignUp ? 'Create Account' : 'Login'}
          </Button>

          {/* Link to other auth page */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button" onClick={() => switchMode(!isSignUp)} className="text-blue-400 hover:text-blue-300 font-medium" disabled={isLoading}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>;
};
export default Login;