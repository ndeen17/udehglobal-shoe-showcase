import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ordersAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Download, Home, ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface OrderSummary {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{
    product: {
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
  };
  createdAt: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await ordersAPI.getOrderById(orderId!) as any;
      setOrder(data.order || data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="brutalist-heading text-3xl tracking-widest mb-2">
            ORDER CONFIRMED!
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {order && (
          <>
            {/* Order Details Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.orderNumber}</CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">PAID</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-sm">Order Items</h3>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* What's Next Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Confirmation Email</p>
                      <p className="text-xs text-gray-600">
                        We've sent you a confirmation email with your order details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Processing</p>
                      <p className="text-xs text-gray-600">
                        Your order is being prepared for shipment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipment & Tracking</p>
                      <p className="text-xs text-gray-600">
                        You'll receive tracking information once shipped
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={`/orders/${orderId}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              View Order Details
            </Button>
          </Link>
          <Link to="/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowRight className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your order?
          </p>
          <Link to="/contact" className="text-sm text-foreground hover:underline">
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
