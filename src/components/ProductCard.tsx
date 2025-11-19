import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useCart } from '@/hooks/useCart';
import { Heart, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getProductId, getProductImageUrl, getProductName, getProductPrice, getProductCategory } from '@/utils/productUtils';
import type { Product, LegacyProduct } from '@/types/Product';

interface ProductCardProps {
  product: Product | LegacyProduct; // Accept both formats
  // Legacy props for backwards compatibility
  id?: string;
  image?: string;
  title?: string;
  price?: string;
  category?: string;
}

const ProductCard = ({ product, id, image, title, price, category }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const { addToCart, loading } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle both new product object and legacy individual props
  const productId = product ? getProductId(product) : id!;
  const productImage = product ? getProductImageUrl(product) : image!;
  const productName = product ? getProductName(product) : title!;
  const productPrice = product ? getProductPrice(product) : price!;
  const productCategory = product ? getProductCategory(product) : category!;
  
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when adding to cart
    
    try {
      await addToCart({
        productId: productId,
        quantity: 1
      });
      
      toast({
        title: 'Added to Cart',
        description: `${productName} has been added to your cart.`,
      });
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when toggling wishlist
    if (inWishlist) {
      removeFromWishlist(productId);
      toast({
        title: 'Removed from Wishlist',
        description: `${productName} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({ 
        id: productId, 
        image: productImage, 
        title: productName, 
        price: productPrice, 
        category: productCategory 
      });
      toast({
        title: 'Added to Wishlist',
        description: `${productName} has been added to your wishlist.`,
      });
    }
  };

  // Get product slug (use the slug field from MongoDB or generate from name)
  const productSlug = product && 'slug' in product && product.slug 
    ? product.slug 
    : productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
          <Link to={`/item/${productSlug}`}>
            <img 
              src={productImage} 
              alt={productName}
              className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
              loading="lazy"
            />
          </Link>
          
          {/* Action Buttons - Always visible on mobile, show on hover on desktop */}
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 ${isHovered ? 'opacity-100' : 'opacity-100 md:opacity-0'} transition-opacity`}>
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 md:w-8 md:h-8 flex items-center justify-center transition-colors ${
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
              disabled={loading}
              className="w-10 h-10 md:w-8 md:h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                aria-label="Add to cart"
              >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        
        {/* Minimal Text Label */}
        <Link to={`/item/${productSlug}`}>
          <div className="pt-2 pb-4 text-center">
            <h3 className="brutalist-body text-xs tracking-wider text-foreground">
              {productName.toUpperCase()}
            </h3>
            <p className="brutalist-body text-xs tracking-wide text-gray-500 mt-1">
              {productPrice}
            </p>
          </div>
        </Link>
        
      </div>
    </div>
  );
};

export default ProductCard;
