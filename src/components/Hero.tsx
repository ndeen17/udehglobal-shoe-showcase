import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
            <img
              src={logo}
              alt="UdehGlobal logo"
              className="h-20 md:h-28 lg:h-32 w-auto object-contain"
            />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] text-foreground">
              UDEHGLOBAL
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
            Premium Comfort Slides
          </p>
          
          <div className="pt-8">
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              variant="outline"
              className="px-12 py-6 text-base font-light tracking-widest border-foreground/20 hover:border-foreground/40 hover:bg-transparent"
            >
              EXPLORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
