import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
}

const ProductCard = ({ image, title, price }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-accent">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">{price}</span>
          <Button 
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Order Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
