import { createContext, useContext, useState, ReactNode } from 'react';

// Types for local-only features (not implemented in backend)
interface WishlistItem {
  id: string; // MongoDB ObjectId format
  title: string;
  price: string;
  image: string;
  category: string;
  addedAt: Date;
}

interface AppContextType {
  // Wishlist state (local storage only - not implemented in backend)
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  
  // Navigation state
  isNavOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
  
  // Cart state (legacy support - actual cart handled by useCart hook)
  cartItems: any[]; // Deprecated - use useCart hook
  cartCount: number; // Deprecated - use useCart hook
  addToCart?: (item: any) => Promise<void>; // Deprecated - use useCart hook
  removeFromCart?: (id: string) => Promise<void>; // Deprecated - use useCart hook
  clearCart?: () => Promise<void>; // Deprecated - use useCart hook
  updateCartQuantity?: (id: string, quantity: number) => Promise<void>; // Deprecated - use useCart hook
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Wishlist state (local storage since backend doesn't have wishlist)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('udeh-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  

  
  // Navigation state
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Wishlist functions
  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    setWishlistItems(prev => {
      const existingItem = prev.find(wishlistItem => wishlistItem.id === item.id);
      if (existingItem) {
        return prev; // Item already in wishlist
      }
      const newWishlist = [...prev, { ...item, addedAt: new Date() }];
      localStorage.setItem('udeh-wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== id);
      localStorage.setItem('udeh-wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('udeh-wishlist');
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };



  // Navigation functions
  const toggleNav = () => setIsNavOpen(prev => !prev);
  const closeNav = () => setIsNavOpen(false);

  // Calculate counts
  const wishlistCount = wishlistItems.length;
  
  // Deprecated cart methods for backwards compatibility
  const deprecatedCartMethods = {
    cartItems: [], // Empty - use useCart hook instead
    cartCount: 0, // Empty - use useCart hook instead
    addToCart: async (item: any) => {
      console.warn('addToCart from AppContext is deprecated. Use useCart hook instead.');
    },
    removeFromCart: async (id: string) => {
      console.warn('removeFromCart from AppContext is deprecated. Use useCart hook instead.');
    },
    clearCart: async () => {
      console.warn('clearCart from AppContext is deprecated. Use useCart hook instead.');
    },
    updateCartQuantity: async (id: string, quantity: number) => {
      console.warn('updateCartQuantity from AppContext is deprecated. Use useCart hook instead.');
    }
  };

  const value: AppContextType = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    isNavOpen,
    toggleNav,
    closeNav,
    ...deprecatedCartMethods
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
export type { WishlistItem };