import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl animate-fade-in">
          {/* Left-aligned Logo and Brand Section */}
          <div className="flex flex-col items-start space-y-8">
            {/* Large Logo */}
            <div className="mb-4">
              <img
                src={logo}
                alt="UdehGlobal logo"
                className="h-48 md:h-60 lg:h-72 xl:h-80 w-auto object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Company Name - Bold and directly under logo */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.05em] text-foreground leading-none">
                UDEH GLOBAL
              </h1>
              
              {/* Tagline */}
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide">
                Premium Comfort Slides
              </p>
              
              {/* CTA Button */}
              <div className="pt-6">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
