import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailVerificationBannerProps {
  email: string;
  onDismiss: () => void;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ email, onDismiss }) => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Please verify your email address
              </p>
              <p className="text-xs text-yellow-700">
                We sent a verification link to <strong>{email}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/resend-verification">
              <Button variant="outline" size="sm" className="text-xs">
                Resend Email
              </Button>
            </Link>
            <button
              onClick={onDismiss}
              className="text-yellow-600 hover:text-yellow-800 p-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
