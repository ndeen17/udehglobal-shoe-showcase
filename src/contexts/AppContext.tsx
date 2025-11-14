import { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
  quantity: number;
}

interface WishlistItem {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
  addedAt: Date;
}

interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  verified: boolean;
  helpful: number;
}

interface AppContextType {
  // Cart state
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  
  // Wishlist state
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  
  // Reviews state
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  getProductReviews: (productId: number) => Review[];
  getAverageRating: (productId: number) => number;
  getRatingCounts: (productId: number) => { [key: number]: number };
  markReviewHelpful: (reviewId: string) => void;
  
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
  
  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist-items');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('product-reviews');
    return saved ? JSON.parse(saved).map((review: any) => ({
      ...review,
      createdAt: new Date(review.createdAt)
    })) : [];
  });
  
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

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Wishlist functions
  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    setWishlistItems(prev => {
      const existingItem = prev.find(wishlistItem => wishlistItem.id === item.id);
      if (existingItem) {
        return prev; // Item already in wishlist
      }
      const newWishlist = [...prev, { ...item, addedAt: new Date() }];
      localStorage.setItem('wishlist-items', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== id);
      localStorage.setItem('wishlist-items', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist-items');
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Review functions
  const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
      helpful: 0
    };
    
    setReviews(prev => {
      const updated = [...prev, newReview];
      localStorage.setItem('product-reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const getProductReviews = (productId: number) => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const getAverageRating = (productId: number) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / productReviews.length;
  };

  const getRatingCounts = (productId: number) => {
    const productReviews = getProductReviews(productId);
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    productReviews.forEach(review => {
      counts[review.rating as keyof typeof counts]++;
    });
    
    return counts;
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews(prev => {
      const updated = prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      );
      localStorage.setItem('product-reviews', JSON.stringify(updated));
      return updated;
    });
  };

  // Navigation functions
  const toggleNav = () => setIsNavOpen(prev => !prev);
  const closeNav = () => setIsNavOpen(false);

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const value: AppContextType = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    reviews,
    addReview,
    getProductReviews,
    getAverageRating,
    getRatingCounts,
    markReviewHelpful,
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
export type { CartItem, WishlistItem, Review };