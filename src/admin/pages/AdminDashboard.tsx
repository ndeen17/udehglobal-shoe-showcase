import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    todayOrders: number;
    pendingOrders: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    customerEmail: string;
    total: number;
    status: string;
    paymentStatus: string;
    date: string;
    items: any[];
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    category: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      const data = result.data;
      
      setDashboardData({
        stats: {
          totalProducts: data.stats.totalProducts,
          totalOrders: data.stats.totalOrders,
          totalCustomers: data.stats.totalCustomers,
          totalRevenue: data.stats.totalRevenue,
          todayOrders: data.stats.todayOrders,
          pendingOrders: data.stats.pendingOrders,
          lowStockProducts: data.stats.lowStockProducts,
          outOfStockProducts: data.stats.outOfStockProducts
        },
        recentOrders: data.recentOrders || [],
        lowStockProducts: data.lowStockProducts || []
      });
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      const errorMessage = error.message || 'Failed to load dashboard data';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Fallback to empty data structure so page still renders
      setDashboardData({
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalRevenue: 0,
          todayOrders: 0,
          pendingOrders: 0,
          lowStockProducts: 0,
          outOfStockProducts: 0
        },
        recentOrders: [],
        lowStockProducts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, text: 'Pending' },
      processing: { variant: 'default' as const, text: 'Processing' },
      shipped: { variant: 'outline' as const, text: 'Shipped' },
      delivered: { variant: 'default' as const, text: 'Delivered' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {admin?.name}! 👋</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Here's what's happening with your store today.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      ) : dashboardData ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  From paid orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.stats.todayOrders} orders today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                  {dashboardData.stats.lowStockProducts} low stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalCustomers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Registered customers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/products/new">
              <Button className="w-full h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Add Product
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex-col">
                <ShoppingCart className="h-6 w-6 mb-2" />
                View Orders
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                Categories
              </Button>
            </Link>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your store</CardDescription>
                </div>
                <Link to="/admin/orders">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {dashboardData.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent orders</p>
                    <p className="text-sm text-gray-500">Orders will appear here when customers make purchases</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(order.total)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription>Products running low on inventory</CardDescription>
                </div>
                <Link to="/admin/products?filter=low-stock">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {dashboardData.lowStockProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">All products in stock</p>
                    <p className="text-sm text-gray-500">Great! No low stock alerts at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={product.stock <= 3 ? "destructive" : "secondary"}>
                            {product.stock} left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-medium">{dashboardData.stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Today's Orders</span>
                    <span className="font-medium">{dashboardData.stats.todayOrders}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Low Stock</span>
                    <span className="font-medium text-amber-600">{dashboardData.stats.lowStockProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Out of Stock</span>
                    <span className="font-medium text-red-600">{dashboardData.stats.outOfStockProducts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Products</span>
                    <span className="font-medium text-green-600">{dashboardData.stats.totalProducts - dashboardData.stats.outOfStockProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(dashboardData.stats.totalRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-6">There was an error loading the dashboard data.</p>
          <Button onClick={loadDashboardData}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;