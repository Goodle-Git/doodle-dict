import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { authService, AuthError, AuthErrorType } from '@/services/auth';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { LoaderCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login({ username, password });
      login(data.access_token, data.user);
      toast({
        title: "Success!",
        description: "Welcome back! You've successfully logged in.",
        variant: "success",
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Clear password field on error
      setPassword('');
      
      const errorMessage = error.response?.data?.detail || error.message;
      let title = "Login Failed";
      let description = "An unexpected error occurred";

      if (errorMessage.includes("User not found")) {
        description = "This username doesn't exist. Please check your username or sign up.";
      } else if (errorMessage.includes("Incorrect password")) {
        description = "Incorrect password. Please try again.";
      } else if (errorMessage.includes("Invalid credentials")) {
        description = "Invalid username or password combination.";
      } else if (error.statusCode === 401) {
        description = "Your session has expired. Please login again.";
      } else if (error.statusCode === 429) {
        description = "Too many login attempts. Please try again later.";
      }

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <CustomButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Login
          </CustomButton>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <GoogleButton />
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;