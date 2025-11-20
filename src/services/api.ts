// Frontend API service for connecting to backend
import { Product } from '../types/Product';
import { Category } from '../types/Category';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function for making API calls
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

// Cart item interface  
export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

// User interface that matches backend
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth response interface
interface AuthResponse {
  user: User;
  token: string;
}

// Categories API
export const categoriesAPI = {
  // Get all active categories
  getCategories: async (): Promise<Category[]> => {
    const response = await makeApiCall('/categories');
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await makeApiCall(`/categories/${slug}`);
    return response.data;
  },

  // Get products by category (using correct backend endpoint)
  getProductsByCategory: async (
    categorySlug: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
    } = {}
  ): Promise<{
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
    category: Category;
  }> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await makeApiCall(`/categories/${categorySlug}/products?${queryParams.toString()}`);
    return response.data;
  }
};

// Products API
export const productsAPI = {
  // Get all products with pagination and filters
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    priceMin?: number;
    priceMax?: number;
    sortBy?: string;
    inStock?: boolean;
  } = {}): Promise<{
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
  }> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await makeApiCall(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await makeApiCall(`/products/featured?limit=${limit}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await makeApiCall(`/products/${slug}`);
    return response.data;
  },

  // Search products with advanced filters
  searchProducts: async (
    query: string,
    params: {
      page?: number;
      limit?: number;
      category?: string;
      sortBy?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      inStock?: boolean;
    } = {}
  ): Promise<{
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
    filters?: {
      categories: Array<{ name: string; slug: string }>;
      priceRange: { minPrice: number; maxPrice: number };
    };
  }> => {
    const queryParams = new URLSearchParams({ q: query });
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await makeApiCall(`/products/search?${queryParams.toString()}`);
    return response.data;
  },

  // Get search suggestions/autocomplete
  getSearchSuggestions: async (query: string, limit: number = 10): Promise<{
    products: Array<{ type: string; text: string; value: string }>;
    categories: Array<{ type: string; text: string; value: string }>;
    tags: Array<{ type: string; text: string; value: string }>;
  }> => {
    if (!query || query.length < 2) {
      return { products: [], categories: [], tags: [] };
    }
    const response = await makeApiCall(`/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  // Get product variants
  getProductVariants: async (productId: string): Promise<any[]> => {
    const response = await makeApiCall(`/products/${productId}/variants`);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId: string): Promise<any[]> => {
    const response = await makeApiCall(`/products/${productId}/reviews`);
    return response.data;
  },

  // Add product review
  addProductReview: async (productId: string, reviewData: {
    rating: number;
    title: string;
    comment: string;
  }): Promise<any> => {
    const response = await makeApiCall(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    const response = await makeApiCall(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  }
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async (): Promise<{
    items: Array<{
      product: Product;
      quantity: number;
      selectedVariants?: { [key: string]: string };
      totalPrice: number;
    }>;
    total: number;
    itemCount: number;
  }> => {
    const response = await makeApiCall('/cart');
    return response.data;
  },

  // Add item to cart (using correct endpoint)
  addToCart: async (item: CartItem): Promise<void> => {
    await makeApiCall('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  // Update cart item quantity (using correct endpoint)
  updateCartItem: async (itemId: string, quantity: number): Promise<void> => {
    await makeApiCall(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  },

  // Remove item from cart (using correct endpoint)
  removeFromCart: async (itemId: string): Promise<void> => {
    await makeApiCall(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    await makeApiCall('/cart/clear', {
      method: 'DELETE'
    });
  },

  // Merge guest cart with user cart (backend endpoint exists)
  mergeCart: async (guestCartItems: CartItem[]): Promise<void> => {
    await makeApiCall('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ items: guestCartItems })
    });
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await makeApiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  // Register
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await makeApiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    await makeApiCall('/auth/logout', {
      method: 'POST'
    });
    localStorage.removeItem('authToken');
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await makeApiCall('/auth/refresh', {
      method: 'POST'
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('user_token', response.data.token);
    }
    
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await makeApiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await makeApiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }
};

// Orders API
export const ordersAPI = {
  // Create order
  createOrder: async (orderData: {
    items: CartItem[];
    shippingAddress: any;
    billingAddress: any;
    paymentMethod: string;
  }): Promise<{
    orderId: string;
    totalAmount: number;
    paymentIntent?: any;
  }> => {
    const response = await makeApiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return response.data;
  },

  // Get user's orders (using correct endpoint)
  getUserOrders: async (): Promise<any[]> => {
    const response = await makeApiCall('/orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<any> => {
    const response = await makeApiCall(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<void> => {
    await makeApiCall(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  },

  // Process payment
  processPayment: async (orderId: string, paymentData: any): Promise<any> => {
    const response = await makeApiCall(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return response.data;
  },

  // Process crypto payment
  processCryptoPayment: async (orderId: string, paymentData: any): Promise<any> => {
    const response = await makeApiCall(`/orders/${orderId}/payment/crypto`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (orderId: string): Promise<any> => {
    const response = await makeApiCall(`/orders/${orderId}/tracking`);
    return response.data;
  }
};

// Users/Profile API
export const usersAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await makeApiCall('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }): Promise<User> => {
    const response = await makeApiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.data;
  },

  // Get user addresses
  getAddresses: async (): Promise<any[]> => {
    const response = await makeApiCall('/users/addresses');
    return response.data;
  },

  // Add new address
  addAddress: async (addressData: any): Promise<any> => {
    const response = await makeApiCall('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
    return response.data;
  },

  // Update address
  updateAddress: async (addressId: string, addressData: any): Promise<any> => {
    const response = await makeApiCall(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<void> => {
    await makeApiCall(`/users/addresses/${addressId}`, {
      method: 'DELETE'
    });
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await makeApiCall('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword })
    });
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    await makeApiCall('/users/account', {
      method: 'DELETE'
    });
  }
};

// Review interface
export interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  product: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  helpfulBy: string[];
  verifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Reviews API
export const reviewsAPI = {
  // Get reviews for a product
  getProductReviews: async (
    productId: string,
    params: {
      sort?: 'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful';
      rating?: number;
      page?: number;
      limit?: number;
      verified?: boolean;
    } = {}
  ): Promise<{
    reviews: Review[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReviews: number;
      limit: number;
    };
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: { [key: number]: number };
    };
  }> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await makeApiCall(`/products/${productId}/reviews?${queryParams.toString()}`);
    return response.data;
  },

  // Get user's review for a product
  getUserProductReview: async (productId: string): Promise<{
    review: Review | null;
    hasPurchased: boolean;
  }> => {
    const response = await makeApiCall(`/products/${productId}/reviews/me`);
    return response.data;
  },

  // Create a review
  createReview: async (
    productId: string,
    data: {
      rating: number;
      title?: string;
      comment: string;
    }
  ): Promise<Review> => {
    const response = await makeApiCall(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  // Update a review
  updateReview: async (
    reviewId: string,
    data: {
      rating: number;
      title?: string;
      comment: string;
    }
  ): Promise<Review> => {
    const response = await makeApiCall(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    await makeApiCall(`/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId: string): Promise<{
    helpful: number;
    hasMarked: boolean;
  }> => {
    const response = await makeApiCall(`/reviews/${reviewId}/helpful`, {
      method: 'POST'
    });
    return response.data;
  }
};

export default {
  categoriesAPI,
  productsAPI,
  cartAPI,
  authAPI,
  ordersAPI,
  usersAPI,
  reviewsAPI
};