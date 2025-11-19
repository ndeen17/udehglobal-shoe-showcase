import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Package, MapPin, CreditCard, Truck, ArrowLeft, Download } from 'lucide-react';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    variant?: {
      variantType: string;
      variantValue: string;
    };
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getOrderById(orderId!);
      setOrder(data.order || data);
    } catch (error: any) {
      console.error('Failed to load order details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link to="/orders" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="brutalist-heading text-2xl tracking-widest mb-2">
              ORDER #{order.orderNumber}
            </h1>
            <p className="brutalist-body text-sm tracking-wide text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
            <Badge className={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
            {order.trackingNumber && (
              <Link to={`/orders/${order._id}/track`}>
                <Button variant="outline" size="sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Track Package
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product._id}`} className="hover:underline">
                          <h3 className="font-semibold truncate">{item.product.name}</h3>
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            {item.variant.variantType}: {item.variant.variantValue}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge className={order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                {order.status === 'pending' && (
                  <Button variant="destructive" className="w-full">
                    Cancel Order
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order Placed</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {order.status !== 'cancelled' && order.status !== 'pending' && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Processing</p>
                        <p className="text-xs text-gray-500">Order is being prepared</p>
                      </div>
                    </div>
                  )}
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Shipped</p>
                        <p className="text-xs text-gray-500">Package in transit</p>
                      </div>
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Delivered</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.status === 'cancelled' && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Cancelled</p>
                        <p className="text-xs text-gray-500">Order was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
