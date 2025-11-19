import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { cartService, Cart, CartItem, AddToCartRequest, UpdateCartRequest } from '../services/cartService';
import { guestCartService, GuestCartItem } from '../services/guestCartService';
import { cartAPI } from '../services/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  updateCartItem: (productId: string, request: UpdateCartRequest) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getItemQuantity: (productId: string, variantId?: string) => number;
  isInCart: (productId: string, variantId?: string) => boolean;
  mergeGuestCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('authToken');
    setIsGuest(!token);
    return !!token;
  }, []);

  const setCartWithHandling = useCallback((newCart: Cart) => {
    setCart(newCart);
    setError(null);
  }, []);

  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Cart ${operation} error:`, error);
    setError(error.message || `Failed to ${operation}`);
    setLoading(false);
  }, []);

  // Convert guest cart to Cart format for display
  const convertGuestCartToCart = useCallback((guestItems: GuestCartItem[]): Cart => {
    return {
      items: guestItems.map((item, index) => ({
        _id: `guest-${index}`,
        product: item.product || {
          _id: item.productId,
          name: 'Loading...',
          price: 0,
          images: [],
          description: ''
        } as any,
        quantity: item.quantity,
        unitPrice: item.product?.price || 0,
        totalPrice: (item.product?.price || 0) * item.quantity,
        addedAt: item.addedAt,
        variantId: item.variantId
      })),
      totalAmount: guestItems.reduce((sum, item) => 
        sum + ((item.product?.price || 0) * item.quantity), 0
      ),
      itemCount: guestItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const authenticated = checkAuthStatus();

      if (authenticated) {
        // Load authenticated user cart
        const cartData = await cartService.getCart();
        setCartWithHandling(cartData);
      } else {
        // Load guest cart from localStorage
        const guestCart = guestCartService.getCart();
        const displayCart = convertGuestCartToCart(guestCart.items);
        setCartWithHandling(displayCart);
      }
    } catch (error: any) {
      handleError(error, 'load cart');
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, setCartWithHandling, handleError, convertGuestCartToCart]);

  const addToCart = useCallback(async (request: AddToCartRequest) => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = checkAuthStatus();

      if (authenticated) {
        // Add to authenticated cart
        const updatedCart = await cartService.addToCart(request);
        setCartWithHandling(updatedCart);
      } else {
        // Add to guest cart
        guestCartService.addItem(
          request.productId,
          request.quantity,
          request.variantId
        );
        await refreshCart(); // Refresh to show updated guest cart
      }
    } catch (error: any) {
      handleError(error, 'add item to cart');
      throw error; // Re-throw for component handling
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, setCartWithHandling, handleError, refreshCart]);

  const updateCartItem = useCallback(async (productId: string, request: UpdateCartRequest) => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = checkAuthStatus();

      if (authenticated) {
        // Update authenticated cart
        const updatedCart = await cartService.updateCartItem(productId, request);
        setCartWithHandling(updatedCart);
      } else {
        // Update guest cart
        guestCartService.updateItem(productId, request.quantity, request.variantId);
        await refreshCart(); // Refresh to show updated guest cart
      }
    } catch (error: any) {
      handleError(error, 'update cart item');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, setCartWithHandling, handleError, refreshCart]);

  const removeFromCart = useCallback(async (productId: string, variantId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = checkAuthStatus();

      if (authenticated) {
        // Remove from authenticated cart
        const updatedCart = await cartService.removeFromCart(productId, variantId);
        setCartWithHandling(updatedCart);
      } else {
        // Remove from guest cart
        guestCartService.removeItem(productId, variantId);
        await refreshCart(); // Refresh to show updated guest cart
      }
    } catch (error: any) {
      handleError(error, 'remove item from cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, setCartWithHandling, handleError, refreshCart]);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const authenticated = checkAuthStatus();

      if (authenticated) {
        // Clear authenticated cart
        const updatedCart = await cartService.clearCart();
        setCartWithHandling(updatedCart);
      } else {
        // Clear guest cart
        guestCartService.clearCart();
        await refreshCart(); // Refresh to show empty cart
      }
    } catch (error: any) {
      handleError(error, 'clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, setCartWithHandling, handleError, refreshCart]);

  // Merge guest cart with authenticated cart (called after login)
  const mergeGuestCart = useCallback(async () => {
    try {
      const authenticated = checkAuthStatus();
      if (!authenticated) {
        console.warn('Cannot merge guest cart: user not authenticated');
        return;
      }

      const guestCart = guestCartService.getCart();
      if (guestCart.items.length === 0) {
        // No guest items to merge
        return;
      }

      setLoading(true);
      // Call backend merge endpoint
      await cartAPI.mergeCart(guestCart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        variantId: item.variantId,
        _id: '',
        product: item.product!,
        unitPrice: item.product?.price || 0,
        totalPrice: (item.product?.price || 0) * item.quantity,
        addedAt: item.addedAt
      })));

      // Clear guest cart after successful merge
      guestCartService.clearCart();

      // Refresh to show merged cart
      await refreshCart();
    } catch (error: any) {
      handleError(error, 'merge guest cart');
      console.error('Failed to merge guest cart:', error);
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus, handleError, refreshCart]);

  // Helper functions
  const getItemQuantity = useCallback((productId: string, variantId?: string): number => {
    const authenticated = checkAuthStatus();
    
    if (authenticated) {
      // Get from authenticated cart
      if (!cart) return 0;
      const item = cart.items.find(item => 
        item.product._id === productId && 
        (!variantId || (item.variant && item.variant._id === variantId))
      );
      return item ? item.quantity : 0;
    } else {
      // Get from guest cart
      return guestCartService.getItemQuantity(productId, variantId);
    }
  }, [cart, checkAuthStatus]);

  const isInCart = useCallback((productId: string, variantId?: string): boolean => {
    return getItemQuantity(productId, variantId) > 0;
  }, [getItemQuantity]);

  // Initialize cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Auto-refresh cart when user logs in/out (detect token changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        // Token changed, refresh cart
        checkAuthStatus();
        refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshCart, checkAuthStatus]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    isGuest,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    getItemQuantity,
    isInCart,
    mergeGuestCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Hook for cart count (useful for header)
export const useCartCount = (): number => {
  const { cart } = useCart();
  return cart?.itemCount || 0;
};

// Hook for cart total (useful for checkout)
export const useCartTotal = (): number => {
  const { cart } = useCart();
  return cart?.totalAmount || 0;
};

export default useCart;