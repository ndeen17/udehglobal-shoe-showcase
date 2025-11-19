import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useApp();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: typeof wishlistItems[0]) => {
    try {
      await addToCart({
        productId: item.id, // item.id is the MongoDB product ID
        quantity: 1
      });
      toast({
        title: 'Added to cart',
        description: `${item.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMoveToCart = async (item: typeof wishlistItems[0]) => {
    try {
      await addToCart({
        productId: item.id, // item.id is the MongoDB product ID
        quantity: 1
      });
      removeFromWishlist(item.id);
      toast({
        title: 'Moved to cart',
        description: `${item.title} has been moved to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to move item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="pt-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1} />
            <span>BACK</span>
          </Link>
        </div>
        
        <div className="text-center pt-32">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-8" strokeWidth={1} />
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-4">
            YOUR WISHLIST IS EMPTY
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-8">
            Save your favorite items for later.
          </p>
          <Link 
            to="/"
            className="brutalist-body text-sm tracking-wider text-foreground hover:text-gray-500 transition-colors duration-300"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back Navigation */}
      <div className="px-8 pt-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Wishlist Content */}
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-2">
                MY WISHLIST ({wishlistCount})
              </h1>
              <p className="brutalist-body text-sm tracking-wide text-gray-500">
                Items you've saved for later
              </p>
            </div>
            
            {wishlistCount > 0 && (
              <Button 
                onClick={clearWishlist}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>CLEAR ALL</span>
              </Button>
            )}
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group">
                <div className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <Link to={`/item/${item.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center transition-colors duration-300"
                      aria-label="Remove from wishlist"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <Link to={`/item/${item.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                        <h3 className="brutalist-body text-sm tracking-wider text-foreground hover:text-gray-500 transition-colors line-clamp-2">
                          {item.title.toUpperCase()}
                        </h3>
                      </Link>
                      <p className="brutalist-body text-xs tracking-wide text-gray-500 mt-1">
                        {typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'Unknown'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="brutalist-body text-sm tracking-wide text-foreground font-medium">
                        {item.price}
                      </span>
                      <span className="brutalist-body text-xs tracking-wide text-gray-400">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-black text-white hover:bg-gray-800 flex items-center justify-center space-x-2"
                        size="sm"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span className="brutalist-body text-xs tracking-wider">MOVE TO CART</span>
                      </Button>
                      
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        variant="outline"
                        className="flex-shrink-0"
                        size="sm"
                      >
                        <span className="brutalist-body text-xs tracking-wider">ADD TO CART</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <Link 
              to="/"
              className="brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
            >
              ← CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;