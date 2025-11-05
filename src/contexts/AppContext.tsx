import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface AppContextType {
  // Cart state
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  
  // Navigation state
  isNavOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Navigation state
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Cart functions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Navigation functions
  const toggleNav = () => setIsNavOpen(prev => !prev);
  const closeNav = () => setIsNavOpen(false);

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value: AppContextType = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
    isNavOpen,
    toggleNav,
    closeNav,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export types
export type { CartItem };