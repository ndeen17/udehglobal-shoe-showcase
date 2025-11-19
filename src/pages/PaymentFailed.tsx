import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, ArrowLeft, HelpCircle } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Payment could not be processed';

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="brutalist-heading text-3xl tracking-widest mb-2">
            PAYMENT FAILED
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Transaction Error</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-sm text-red-800">
                Your order has not been placed and no charges have been made to your account.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Common Issues:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Incorrect card details or expired card</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Your bank declined the transaction</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Network connection issues</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* What to Do Next Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Should I Do?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Check Your Payment Details</p>
                  <p className="text-xs text-gray-600">
                    Verify your card number, expiration date, and CVV are correct
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Try a Different Payment Method</p>
                  <p className="text-xs text-gray-600">
                    Use an alternative card or payment option
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Contact Your Bank</p>
                  <p className="text-xs text-gray-600">
                    If the problem persists, contact your bank to authorize the transaction
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link to="/checkout" className="flex-1">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Link>
          <Link to="/cart" className="flex-1">
            <Button variant="outline" className="w-full">
              Return to Cart
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact" className="flex-1">
            <Button variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Your cart items are still saved. You can complete your purchase anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
