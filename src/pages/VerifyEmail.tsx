import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const { mergeGuestCart } = useCart();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Auto-login: Save tokens and user data
          if (data.data.accessToken && data.data.refreshToken) {
            localStorage.setItem('authToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('auth-user', JSON.stringify(data.data.user));
            
            // Update auth context
            await checkAuth();
            
            // Merge guest cart
            try {
              await mergeGuestCart();
              toast({
                title: "Welcome!",
                description: "Your account is now verified and your cart is ready.",
              });
            } catch (mergeError) {
              console.error('Failed to merge guest cart:', mergeError);
            }
            
            // Check for redirect destination
            const checkoutRedirect = localStorage.getItem('checkout-redirect');
            const redirectPath = checkoutRedirect ? '/checkout' : '/';
            
            // Redirect after 2 seconds
            setTimeout(() => {
              navigate(redirectPath);
            }, 2000);
          } else {
            // Fallback: redirect to login if no tokens
            setTimeout(() => {
              navigate('/login?verified=true');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Email verification failed. The link may be invalid or expired.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Failed to verify email. Please try again later.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="px-8 py-16 max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'Verifying your email address...'}
              {status === 'success' && 'Verification successful'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {status === 'loading' && (
                <>
                  <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
                  <p className="text-gray-600">Please wait while we verify your email...</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  <div>
                    <p className="text-gray-700 font-medium mb-2">{message}</p>
                    <p className="text-sm text-gray-600">
                      You're now logged in and can access all features.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Redirecting you now...
                    </p>
                  </div>
                  <Link to="/">
                    <Button className="w-full">Continue Shopping</Button>
                  </Link>
                </>
              )}

              {status === 'error' && (
                <>
                  <XCircle className="w-16 h-16 mx-auto text-red-500" />
                  <div>
                    <p className="text-gray-700 font-medium mb-2">{message}</p>
                    <p className="text-sm text-gray-600">
                      The verification link may have expired or is invalid.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link to="/resend-verification">
                      <Button variant="outline" className="w-full">
                        Resend Verification Email
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
