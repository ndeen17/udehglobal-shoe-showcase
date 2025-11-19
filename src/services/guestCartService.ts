// Guest Cart Service - LocalStorage-based cart for non-authenticated users
import type { Product } from '@/types/Product';

export interface GuestCartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  product?: Product; // Cached product data
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
  totalItems: number;
  lastUpdated: string;
}

class GuestCartService {
  private storageKey = 'guest_cart';

  // Get guest cart from localStorage
  getCart(): GuestCart {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (!cartData) {
        return this.createEmptyCart();
      }
      return JSON.parse(cartData);
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return this.createEmptyCart();
    }
  }

  // Create empty cart structure
  private createEmptyCart(): GuestCart {
    return {
      items: [],
      totalItems: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Save cart to localStorage
  private saveCart(cart: GuestCart): void {
    try {
      cart.lastUpdated = new Date().toISOString();
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  // Add item to guest cart
  addItem(productId: string, quantity: number = 1, variantId?: string, product?: Product): void {
    const cart = this.getCart();
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.variantId === variantId
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
      if (product) {
        cart.items[existingItemIndex].product = product;
      }
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        variantId,
        product,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart(cart);
  }

  // Update item quantity
  updateItem(productId: string, quantity: number, variantId?: string): void {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(
      item => item.productId === productId && item.variantId === variantId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }
  }

  // Remove item from cart
  removeItem(productId: string, variantId?: string): void {
    const cart = this.getCart();
    cart.items = cart.items.filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );
    this.saveCart(cart);
  }

  // Clear entire cart
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Get item count
  getItemCount(): number {
    const cart = this.getCart();
    return cart.totalItems;
  }

  // Get specific item quantity
  getItemQuantity(productId: string, variantId?: string): number {
    const cart = this.getCart();
    const item = cart.items.find(
      item => item.productId === productId && item.variantId === variantId
    );
    return item ? item.quantity : 0;
  }

  // Check if item is in cart
  isInCart(productId: string, variantId?: string): boolean {
    return this.getItemQuantity(productId, variantId) > 0;
  }

  // Get cart data formatted for backend merge
  getCartForMerge(): Array<{ productId: string; quantity: number; variantId?: string }> {
    const cart = this.getCart();
    return cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      variantId: item.variantId
    }));
  }

  // Check if guest cart exists and has items
  hasItems(): boolean {
    const cart = this.getCart();
    return cart.items.length > 0;
  }
}

// Export singleton instance
export const guestCartService = new GuestCartService();
export default guestCartService;
