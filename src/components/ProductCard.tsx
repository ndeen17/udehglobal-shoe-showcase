import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
}

const ProductCard = ({ id, image, title, price }: ProductCardProps) => {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when adding to cart
    addToCart({ id, image, title, price });
  };

  return (
    <Link 
      to={`/item/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
      className="block group"
    >
      {/* Yeezy-Style Minimal Card */}
      <div className="bg-background">
        
        {/* Image taking maximum space */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
            loading="lazy"
          />
        </div>
        
        {/* Minimal Text Label */}
        <div className="pt-2 pb-4 text-center">
          <h3 className="brutalist-body text-xs tracking-wider text-foreground">
            {title.toUpperCase()}
          </h3>
        </div>
        
      </div>
    </Link>
  );
};

export default ProductCard;
