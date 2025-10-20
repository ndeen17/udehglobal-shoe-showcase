import { Card } from "@/components/ui/card";

interface ArtworkCardProps {
  image: string;
  title: string;
}

const ArtworkCard = ({ image, title }: ArtworkCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/30 hover:border-foreground/20 transition-all duration-500 w-full">
      <div className="aspect-[3/4] overflow-hidden bg-secondary">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-sm sm:text-base font-light text-foreground tracking-wide">{title}</h3>
      </div>
    </Card>
  );
};

export default ArtworkCard;
