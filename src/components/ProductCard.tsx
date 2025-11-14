import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Heart, Plus } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  category: string;
}

const ProductCard = ({ id, image, title, price, category }: ProductCardProps) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when adding to cart
    addToCart({ id, image, title, price, category });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when toggling wishlist
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, image, title, price, category });
    }
  };

  return (
    <div 
      className="block group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Yeezy-Style Minimal Card */}
      <div className="bg-background">
        
        {/* Image taking maximum space */}
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <Link to={`/item/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
              loading="lazy"
            />
          </Link>
          
          {/* Action Buttons - Show on Hover */}
          {isHovered && (
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  inWishlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} 
                  strokeWidth={1.5}
                />
              </button>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Add to cart"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        
        {/* Minimal Text Label */}
        <Link to={`/item/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
          <div className="pt-2 pb-4 text-center">
            <h3 className="brutalist-body text-xs tracking-wider text-foreground">
              {title.toUpperCase()}
            </h3>
            <p className="brutalist-body text-xs tracking-wide text-gray-500 mt-1">
              {price}
            </p>
          </div>
        </Link>
        
      </div>
    </div>
  );
};

export default ProductCard;
