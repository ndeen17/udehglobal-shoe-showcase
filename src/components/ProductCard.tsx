import { Card } from "@/components/ui/card";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
}

const ProductCard = ({ image, title, price }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/30 hover:border-foreground/20 transition-all duration-500 w-full">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-foreground tracking-wide leading-tight">{title}</h3>
        <span className="text-lg sm:text-xl md:text-xl font-light text-foreground/80">{price}</span>
      </div>
    </Card>
  );
};

export default ProductCard;
