import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Star, Plus, Minus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useCart } from '@/hooks/useCart';
import StarRating from '@/components/StarRating';
import ReviewsList from '@/components/ReviewsList';
import { productsAPI } from '@/services/api';
import { Product } from '@/types/Product';
import { useToast } from '@/components/ui/use-toast';
import { getProductId, getProductImageUrl, getProductName, getProductPrice, getProductCategory } from '@/utils/productUtils';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToWishlist, removeFromWishlist, isInWishlist, getAverageRating, getProductReviews } = useApp();
  const { addToCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        
        // Use the direct API endpoint to get product by slug
        const foundProduct = await productsAPI.getProductBySlug(slug);
        
        if (!foundProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(foundProduct);
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        setError(error.message || 'Failed to load product');
        toast({
          title: 'Error',
          description: 'Failed to load product details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, toast]);
  
  const inWishlist = product ? isInWishlist(getProductId(product)) : false;

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    const productId = getProductId(product);
    
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        image: getProductImageUrl(product),
        title: getProductName(product),
        price: getProductPrice(product),
        category: getProductCategory(product)
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="text-center pt-16">
          <h1 className="brutalist-heading text-2xl tracking-widest text-foreground mb-8">
            LOADING...
          </h1>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="text-center pt-16">
          <h1 className="brutalist-heading text-2xl tracking-widest text-foreground mb-8">
            {error || 'PRODUCT NOT FOUND'}
          </h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            GO BACK
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const productId = getProductId(product);
      await addToCart({
        productId: productId,
        quantity: quantity
      });
      
      toast({
        title: 'Added to Cart',
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
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

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      
      {/* Back Navigation */}
      <div className="px-4 md:px-8 pt-4 md:pt-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300 py-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Product Detail Content */}
      <div className="px-4 md:px-8 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            
            {/* Product Image */}
            <div className="aspect-square bg-gray-100">
              <img 
                src={getProductImageUrl(product)} 
                alt={product.name}
                className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-12">
              
              {/* Header */}
              <div className="space-y-3 md:space-y-6">
                <Badge variant="secondary" className="mb-2 md:mb-4">
                  {getProductCategory(product).toUpperCase()}
                </Badge>
                <h1 className="brutalist-heading text-xl md:text-2xl tracking-widest text-foreground">
                  {product.name.toUpperCase()}
                </h1>
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <span className="brutalist-subheading text-base md:text-lg tracking-wider text-foreground">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.stockQuantity > 0 ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      IN STOCK
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      OUT OF STOCK
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating 
                  rating={getAverageRating(getProductId(product))} 
                  size="sm" 
                  interactive={false}
                />
                <span className="brutalist-body text-xs tracking-wide text-gray-500">
                  {getAverageRating(getProductId(product)).toFixed(1)} ({getProductReviews(getProductId(product)).length} REVIEWS)
                </span>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  {product.description || 'PREMIUM COMFORT DESIGN WITH ERGONOMIC FOOTBED'}
                </p>
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  LIGHTWEIGHT CONSTRUCTION FOR ALL-DAY WEAR
                </p>
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  DURABLE MATERIALS AND SUPERIOR CRAFTSMANSHIP
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3 md:space-y-4">
                <label className="brutalist-body text-sm tracking-wider text-foreground">
                  QUANTITY
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border">
                    <button
                      onClick={() => handleQuantityChange(false)}
                      className="p-3 md:p-3 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5 md:w-4 md:h-4" />
                    </button>
                    <span className="px-4 md:px-6 py-3 brutalist-body text-sm tracking-wider min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(true)}
                      className="p-3 md:p-3 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 md:space-y-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0 || cartLoading}
                  className="w-full h-14 md:h-12 tracking-wider brutalist-body text-sm md:text-base"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {cartLoading ? 'ADDING...' : `ADD TO CART (${quantity})`}
                </Button>
                
                <div className="flex gap-2 md:gap-4">
                  <Button
                    variant="outline"
                    onClick={handleToggleWishlist}
                    className="flex-1 h-14 md:h-12 tracking-wider text-xs sm:text-sm"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current text-red-500' : ''}`} />
                    {inWishlist ? 'WISHLISTED' : 'ADD TO WISHLIST'}
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-14 md:h-12 w-14 md:w-12 min-w-[56px] min-h-[56px] md:min-w-[48px] md:min-h-[48px]">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6 md:pt-8">
                <h3 className="brutalist-body text-xs md:text-sm tracking-wider text-foreground mb-3 md:mb-4">
                  PRODUCT FEATURES
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="brutalist-body text-xs tracking-wide text-gray-600">Material</span>
                    <span className="brutalist-body text-xs tracking-wide text-foreground">Premium Quality</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="brutalist-body text-xs tracking-wide text-gray-600">Origin</span>
                    <span className="brutalist-body text-xs tracking-wide text-foreground">Manufactured with Care</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="brutalist-body text-xs tracking-wide text-gray-600">Warranty</span>
                    <span className="brutalist-body text-xs tracking-wide text-foreground">1 Year</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="brutalist-body text-xs tracking-wide text-gray-600">Shipping</span>
                    <span className="brutalist-body text-xs tracking-wide text-foreground">Free Delivery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-8 md:mt-16 pt-8 md:pt-16 border-t border-gray-200">
            <ReviewsList 
              productId={getProductId(product)} 
              productName={getProductName(product)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;