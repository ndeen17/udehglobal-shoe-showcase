import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye,
  Download,
  MoreVertical,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { adminOrderAPI, type Order } from '../api/admin-api';
import { useToast } from '../../components/ui/use-toast';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [currentPage, selectedStatus, searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminOrderAPI.getOrders({
        page: currentPage,
        limit: 15,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchTerm || undefined
      });
      
      setOrders(response.orders);
      setTotalPages(response.pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await adminOrderAPI.updateOrderStatus(orderId, newStatus);
      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus}`,
      });
      loadOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: ShoppingCart, text: 'Pending' },
      processing: { variant: 'default' as const, icon: Package, text: 'Processing' },
      shipped: { variant: 'outline' as const, icon: Truck, text: 'Shipped' },
      delivered: { variant: 'default' as const, icon: CheckCircle, text: 'Delivered' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, text: 'Cancelled' },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, text: 'Pending' },
      paid: { variant: 'default' as const, text: 'Paid' },
      failed: { variant: 'destructive' as const, text: 'Failed' },
      refunded: { variant: 'outline' as const, text: 'Refunded' },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const OrderDetailsDialog = ({ order }: { order: Order }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details - {order.orderNumber || order._id}</DialogTitle>
        <DialogDescription>
          Order placed on {new Date(order.createdAt).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-medium">Order Status</p>
              {getStatusBadge(order.orderStatus)}
            </div>
            <div>
              <p className="font-medium">Payment Status</p>
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
          </div>
        </div>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{typeof order.user === 'string' ? 'Customer' : order.user}</p>
                <p className="text-sm text-gray-600">Order #{order.orderNumber || order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-medium capitalize">{order.paymentStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items ({order.items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">ID: {item.product}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span>{order.orderNumber || order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="capitalize">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Status:</span>
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button 
            onClick={() => handleStatusUpdate(order._id, 'processing')}
            disabled={order.orderStatus === 'processing'}
            size="sm"
          >
            Mark as Processing
          </Button>
          <Button 
            onClick={() => handleStatusUpdate(order._id, 'shipped')}
            disabled={order.orderStatus === 'shipped' || order.orderStatus === 'delivered'}
            size="sm"
          >
            Mark as Shipped
          </Button>
          <Button 
            onClick={() => handleStatusUpdate(order._id, 'delivered')}
            disabled={order.orderStatus === 'delivered'}
            size="sm"
          >
            Mark as Delivered
          </Button>
          <Button 
            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
            disabled={order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
            variant="destructive"
            size="sm"
          >
            Cancel Order
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here once customers start purchasing.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order.orderNumber || order._id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{typeof order.user === 'string' ? 'Customer' : order.user}</p>
                          <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.orderStatus)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedOrder && <OrderDetailsDialog order={selectedOrder} />}
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'processing')}>
                              <Package className="h-4 w-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'shipped')}>
                              <Truck className="h-4 w-4 mr-2" />
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'delivered')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;