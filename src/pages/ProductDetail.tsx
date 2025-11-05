import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

// Import your product data
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, image: product1, title: "Premium Comfort Slides - Multi Color", price: "₦15,000" },
  { id: 2, image: product2, title: "Classic Black Slides", price: "₦15,000" },
  { id: 3, image: product3, title: "Sport White Slides", price: "₦15,000" },
  { id: 4, image: product4, title: "Navy Blue Comfort Slides", price: "₦15,000" },
  { id: 5, image: product5, title: "Designer Black Slides", price: "₦15,000" },
  { id: 6, image: product6, title: "Flip Flop Style Slides", price: "₦15,000" },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useApp();

  // Find product by slug
  const product = products.find(p => 
    p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
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
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      
      {/* Back Navigation */}
      <div className="px-brutalist-md pt-brutalist-md">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Product Detail Content */}
      <div className="px-brutalist-md py-brutalist-xl">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-brutalist-xl">
            
            {/* Product Image */}
            <div className="aspect-square bg-secondary">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-brutalist-lg">
              
              <div className="space-y-brutalist-md">
                <h1 className="font-brutalist text-brutalist-xl font-light tracking-widest text-foreground">
                  {product.title.toUpperCase()}
                </h1>
                
                <p className="font-brutalist text-brutalist-lg font-light tracking-wider text-foreground">
                  {product.price}
                </p>
              </div>

              {/* Product Description */}
              <div className="space-y-brutalist-sm">
                <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
                  PREMIUM COMFORT DESIGN WITH ERGONOMIC FOOTBED
                </p>
                <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
                  LIGHTWEIGHT CONSTRUCTION FOR ALL-DAY WEAR
                </p>
                <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-muted-foreground leading-relaxed">
                  DURABLE MATERIALS AND SUPERIOR CRAFTSMANSHIP
                </p>
              </div>

              {/* Add to Cart */}
              <div className="pt-brutalist-md">
                <button 
                  onClick={handleAddToCart}
                  className="font-brutalist text-brutalist-sm font-light tracking-widest text-foreground hover:text-muted-foreground transition-colors duration-300 bg-transparent border-0 p-0"
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