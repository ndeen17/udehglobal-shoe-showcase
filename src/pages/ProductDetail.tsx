import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllProducts } from '@/data/categories';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useApp();

  // Get all products and find the one matching the slug
  const allProducts = getAllProducts();
  const product = allProducts.find(p => 
    p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20 px-brutalist-md">
        <div className="text-center pt-brutalist-2xl">
          <h1 className="font-brutalist text-brutalist-lg font-light tracking-widest text-foreground mb-brutalist-md">
            PRODUCT NOT FOUND
          </h1>
          <Link 
            to="/"
            className="font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      image: product.image,
      title: product.name,
      price: product.price
    });
  };

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

      {/* Product Detail Content */}
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Product Image */}
            <div className="aspect-square bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-16">
              
              <div className="space-y-8">
                <h1 className="brutalist-heading text-2xl tracking-widest text-foreground">
                  {product.name.toUpperCase()}
                </h1>
                
                <p className="brutalist-subheading text-lg tracking-wider text-foreground">
                  {product.price}
                </p>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  PREMIUM COMFORT DESIGN WITH ERGONOMIC FOOTBED
                </p>
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  LIGHTWEIGHT CONSTRUCTION FOR ALL-DAY WEAR
                </p>
                <p className="brutalist-body text-sm tracking-wide text-gray-500 leading-relaxed">
                  DURABLE MATERIALS AND SUPERIOR CRAFTSMANSHIP
                </p>
              </div>

              {/* Add to Cart */}
              <div className="pt-8">
                <button 
                  onClick={handleAddToCart}
                  className="brutalist-body text-xs tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 bg-transparent border-0 p-0"
                >
                  ADD TO CART
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;