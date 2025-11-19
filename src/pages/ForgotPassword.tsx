import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setEmailSent(true);
      toast({
        title: 'Email Sent',
        description: 'Password reset instructions have been sent to your email',
      });
    } catch (error: any) {
      console.error('Failed to send reset email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back Navigation */}
      <div className="px-8 pt-8">
        <Link 
          to="/login"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK TO LOGIN</span>
        </Link>
      </div>

      <div className="px-8 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Forgot Password</CardTitle>
              <CardDescription className="text-center">
                {emailSent
                  ? 'Check your email for reset instructions'
                  : 'Enter your email to receive reset instructions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  <div>
                    <p className="text-gray-700 mb-2">
                      We've sent password reset instructions to:
                    </p>
                    <p className="font-semibold">{email}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="w-full"
                  >
                    Try Different Email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-500">Remember your password? </span>
                    <Link to="/login" className="text-foreground hover:text-gray-500 transition-colors">
                      Sign in
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
