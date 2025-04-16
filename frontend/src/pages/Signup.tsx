import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';  // Updated import
import { GoogleButton } from '@/components/auth/GoogleButton';
import { LoaderCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AuthError } from '@/services/auth';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!username || !email || !password || !name) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.signup({ username, email, password, name });
      login(data.access_token, data.user);
      toast({
        title: "Success!",
        description: "Your account has been created successfully!",
        variant: "success",
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Clear password field on error
      setPassword('');
      
      const errorMessage = error.response?.data?.detail || error.message;
      let title = "Signup Failed";
      let description = "An unexpected error occurred";

      if (errorMessage.includes("Username is already taken")) {
        description = "This username is already taken. Please choose another one.";
      } else if (errorMessage.includes("Email is already registered")) {
        description = "This email is already registered. Please use a different email or login.";
      } else if (errorMessage.includes("Invalid username")) {
        description = "Username can only contain letters, numbers, and underscores.";
      } else if (errorMessage.includes("Invalid email")) {
        description = "Please enter a valid email address.";
      } else if (error.statusCode === 429) {
        description = "Too many signup attempts. Please try again later.";
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
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </CustomButton>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <div className="mt-6">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
};

export default Signup;