export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  paymentId?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentRequest {
  paymentId?: string;
}

export interface CryptoPaymentRequest {
  walletAddress: string;
  transactionHash: string;
  amount: number;
}

class OrderService {
  private token: string | null = null;
  private baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/orders`;

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    const result = await this.handleResponse<{ order: Order }>(response);
    return result.order;
  }

  async getOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    const url = new URL(this.baseURL);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: this.getHeaders()
    });
    return await this.handleResponse<OrdersResponse>(response);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await fetch(`${this.baseURL}/${orderId}`, {
      headers: this.getHeaders()
    });
    const result = await this.handleResponse<{ order: Order }>(response);
    return result.order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${this.baseURL}/${orderId}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    const result = await this.handleResponse<{ order: Order }>(response);
    return result.order;
  }

  async processPayment(orderId: string, request: PaymentRequest): Promise<Order> {
    const response = await fetch(`${this.baseURL}/${orderId}/payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    const result = await this.handleResponse<{ order: Order }>(response);
    return result.order;
  }

  async processCryptoPayment(orderId: string, request: CryptoPaymentRequest): Promise<Order> {
    const response = await fetch(`${this.baseURL}/${orderId}/payment/crypto`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    const result = await this.handleResponse<{ order: Order }>(response);
    return result.order;
  }

  async getOrderTracking(orderId: string): Promise<{
    orderNumber: string;
    orderStatus: string;
    trackingNumber?: string;
    lastUpdated: string;
  }> {
    const response = await fetch(`${this.baseURL}/${orderId}/tracking`, {
      headers: this.getHeaders()
    });
    return await this.handleResponse<{
      orderNumber: string;
      orderStatus: string;
      trackingNumber?: string;
      lastUpdated: string;
    }>(response);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const orderService = new OrderService();
export default orderService;