import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
          {/* Left Side - Logo and Brand */}
          <div className="flex flex-col items-start space-y-8">
            <div className="relative">
              <img
                src={logo}
                alt="UdehGlobal logo"
                className="h-48 md:h-64 lg:h-80 xl:h-96 w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.1em] text-foreground leading-tight">
                UDEH GLOBAL
              </h1>
              <div className="w-32 h-1.5 bg-foreground/30 rounded-full"></div>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide leading-relaxed">
                Premium Comfort Slides
              </p>
            </div>
          </div>
          
          {/* Right Side - Content */}
          <div className="flex flex-col justify-center space-y-8 text-left lg:text-left">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground/80 leading-relaxed">
                Experience unmatched comfort and style with our premium collection
              </h2>
              <div className="pt-4">
                <Button 
                  size="lg" 
                  onClick={scrollToProducts}
                  variant="outline"
                  className="px-12 py-6 text-base font-light tracking-widest border-foreground/20 hover:border-foreground/40 hover:bg-transparent"
                >
                  EXPLORE COLLECTION
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
