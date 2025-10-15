import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-16 animate-fade-in">
          {/* Logo and Brand Section */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <img
                src={logo}
                alt="UdehGlobal logo"
                className="h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain drop-shadow-lg"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[0.1em] text-foreground">
                UDEH GLOBAL
              </h1>
              <div className="w-24 h-1 bg-foreground/20 mx-auto rounded-full"></div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
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
