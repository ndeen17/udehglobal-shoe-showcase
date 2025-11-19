// Admin API functions for backend integration
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper function to get auth token (consistent with main app)
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken'); // Use same token key as main app
};

// Helper function for making authenticated API calls
const makeApiCall = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Order interface that matches backend
export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Customer interface that matches backend User model
export interface Customer {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// Product Management APIs
export const adminProductAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<{ products: Product[]; total: number; pages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await makeApiCall(`/admin/products?${queryParams}`);
    return {
      products: response.data.products,
      total: response.data.total,
      pages: response.data.pages
    };
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await makeApiCall(`/admin/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await makeApiCall('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
    const response = await makeApiCall(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    await makeApiCall(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  // Bulk update products
  bulkUpdateProducts: async (updates: { id: string; data: Partial<Product> }[]): Promise<boolean> => {
    await makeApiCall('/admin/products/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
    return true;
  },

  // Upload product images
  uploadProductImages: async (productId: string, images: File[]): Promise<{ images: Array<{ url: string; altText: string; isPrimary: boolean; displayOrder: number }>; uploadedCount: number }> => {
    const formData = new FormData();
    
    // Add images to form data
    if (images.length === 1) {
      formData.append('primaryImage', images[0]);
    } else {
      images.forEach((image, index) => {
        if (index === 0) {
          formData.append('primaryImage', image);
        } else {
          formData.append('additionalImages', image);
        }
      });
    }

    // Make API call with FormData (no JSON Content-Type header)
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload images');
    }

    const result = await response.json();
    return result.data;
  },

  // Delete product image
  deleteProductImage: async (productId: string, imageId: string): Promise<boolean> => {
    await makeApiCall(`/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
    return true;
  }
};

// Order Management APIs
export const adminOrderAPI = {
  // Get all orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<{ orders: Order[]; total: number; pages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params?.search) queryParams.append('search', params.search);

    const response = await makeApiCall(`/admin/orders?${queryParams}`);
    return {
      orders: response.data.orders,
      total: response.data.total,
      pages: response.data.pages
    };
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['orderStatus'], notes?: string): Promise<Order> => {
    const response = await makeApiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
    return response.data;
  },

  // Get order details
  getOrder: async (id: string): Promise<Order> => {
    const response = await makeApiCall(`/admin/orders/${id}`);
    return response.data;
  }
};

// Customer Management APIs
export const adminCustomerAPI = {
  // Get all customers
  getCustomers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ customers: Customer[]; total: number; pages: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await makeApiCall(`/admin/users?${queryParams}`);
    return {
      customers: response.data.customers,
      total: response.data.total,
      pages: response.data.pages
    };
  },

  // Update customer status
  updateCustomerStatus: async (customerId: string, status: 'active' | 'inactive'): Promise<boolean> => {
    await makeApiCall(`/admin/users/${customerId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: status === 'active' }),
    });
    return true;
  }
};

// Category Management APIs
export const adminCategoryAPI = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await makeApiCall('/admin/categories');
    return response.data;
  },

  // Create category
  createCategory: async (categoryData: Omit<Category, '_id' | 'productsCount'>): Promise<Category> => {
    const response = await makeApiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  // Update category
  updateCategory: async (id: string, categoryData: Partial<Omit<Category, '_id'>>): Promise<Category> => {
    const response = await makeApiCall(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<boolean> => {
    await makeApiCall(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
};

// Analytics APIs
export const adminAnalyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
  }> => {
    const response = await makeApiCall('/admin/dashboard');
    const data = response.data;
    
    return {
      totalRevenue: data.stats.totalRevenue,
      totalOrders: data.stats.totalOrders,
      totalCustomers: data.stats.totalCustomers,
      totalProducts: data.stats.totalProducts,
      revenueGrowth: 12.5, // These would come from analytics endpoint
      ordersGrowth: 8.3,
      customersGrowth: 15.2
    };
  },

  // Get sales data for charts
  getSalesData: async (period: 'week' | 'month' | 'year'): Promise<{
    labels: string[];
    revenue: number[];
    orders: number[];
  }> => {
    const response = await makeApiCall(`/admin/analytics/sales?period=${period}`);
    return response.data;
  }
};

// Notification APIs
export const adminNotificationAPI = {
  // Send notification to customers
  sendNotification: async (notification: {
    type: 'email' | 'push' | 'sms';
    recipients: string[];
    subject: string;
    message: string;
    scheduled?: string;
  }): Promise<boolean> => {
    await makeApiCall('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    return true;
  },

  // Get notification history
  getNotificationHistory: async (): Promise<{
    id: string;
    type: string;
    subject: string;
    sentAt: string;
    recipients: number;
    status: 'sent' | 'failed' | 'pending';
  }[]> => {
    // This endpoint would need to be implemented in the backend
    return [];
  }
};