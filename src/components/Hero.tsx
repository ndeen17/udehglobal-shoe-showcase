import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] bg-background text-foreground">
      {/* Small Logo in Top-Left Corner */}
      <div className="absolute top-6 left-6 z-10">
        <img
          src={logo}
          alt="UdehGlobal logo"
          className="h-12 md:h-16 w-auto object-contain opacity-80"
        />
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-[90vh] px-8 md:px-16 lg:px-20">
        <div className="w-full max-w-4xl text-center animate-fade-in">
          {/* Central Text Block */}
          <div className="space-y-6 md:space-y-8">
            {/* Brand Name - Largest */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-800 tracking-[0.15em] leading-none" 
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              UDEH GLOBAL
            </h1>
            
            {/* Main Headline */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-700 tracking-[0.1em] leading-tight"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              The Art of Effortless Comfort
            </h2>
            
            {/* Sub-Headline / Product Category */}
            <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-gray-500 tracking-[0.08em] leading-relaxed"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              Premium Comfort Slides
            </h3>
          </div>

          {/* CTA Button */}
          <div className="mt-12 md:mt-16">
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              variant="outline"
              className="px-8 py-4 text-sm font-light tracking-[0.2em] border-gray-400 hover:border-gray-600 hover:bg-transparent text-gray-700 hover:text-gray-900"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
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
