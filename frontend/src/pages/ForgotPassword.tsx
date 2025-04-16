import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ email, newPassword });
      toast({
        title: "Success!",
        description: "Password has been reset successfully.",
        variant: "success",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Password reset failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <CustomButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Reset Password
          </CustomButton>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
