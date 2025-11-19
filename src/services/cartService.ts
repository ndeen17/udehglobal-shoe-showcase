import type { Product } from '@/types/Product';

export interface CartItem {
  _id: string;
  product: Product;
  variant?: {
    _id: string;
    variantType: string;
    variantValue: string;
    priceAdjustment: number;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  updatedAt?: string;
  guestId?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variantId?: string;
}

export interface UpdateCartRequest {
  quantity: number;
  variantId?: string;
}

class CartService {
  private token: string | null = null;
  private baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/cart`;

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add auth token - authentication is required for cart operations
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

  async getCart(): Promise<Cart> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Return empty cart if not authenticated
        return {
          items: [],
          totalAmount: 0,
          itemCount: 0
        };
      }

      const response = await fetch(this.baseURL, {
        headers: this.getHeaders()
      });
      const result = await this.handleResponse<{ cart: Cart }>(response);
      return result.cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      // Return empty cart on error
      return {
        items: [],
        totalAmount: 0,
        itemCount: 0
      };
    }
  }

  async addToCart(request: AddToCartRequest): Promise<Cart> {
    const response = await fetch(`${this.baseURL}/items`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    const result = await this.handleResponse<{ cart: Cart }>(response);
    return result.cart;
  }

  async updateCartItem(productId: string, request: UpdateCartRequest): Promise<Cart> {
    const response = await fetch(`${this.baseURL}/items/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    const result = await this.handleResponse<{ cart: Cart }>(response);
    return result.cart;
  }

  async removeFromCart(productId: string, variantId?: string): Promise<Cart> {
    const url = new URL(`${this.baseURL}/items/${productId}`);
    if (variantId) {
      url.searchParams.append('variantId', variantId);
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    const result = await this.handleResponse<{ cart: Cart }>(response);
    return result.cart;
  }

  async clearCart(): Promise<Cart> {
    const response = await fetch(`${this.baseURL}/clear`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    const result = await this.handleResponse<{ cart: Cart }>(response);
    return result.cart;
  }

  // Helper method to get cart item count (for header display)
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.itemCount;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  // Helper method to get cart total
  async getCartTotal(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.totalAmount;
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const cartService = new CartService();
export default cartService;