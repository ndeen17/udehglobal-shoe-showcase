import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] bg-background text-foreground pt-16 sm:pt-20">
      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-[90vh] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="w-full max-w-5xl text-center animate-fade-in">
          {/* Central Text Block */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            {/* Brand Name - Largest */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-gray-800 tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em] leading-none px-2" 
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              UDEH GLOBAL
            </h1>
            
            {/* Main Headline */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-light text-gray-700 tracking-[0.08em] sm:tracking-[0.09em] md:tracking-[0.1em] leading-tight px-4"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              The Art of Effortless Comfort
            </h2>
            
            {/* Sub-Headline / Product Category */}
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-gray-500 tracking-[0.06em] sm:tracking-[0.07em] md:tracking-[0.08em] leading-relaxed px-4"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
              Premium Comfort Slides
            </h3>
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
            <Button 
              size="lg" 
              onClick={scrollToProducts}
              variant="outline"
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-light tracking-[0.15em] sm:tracking-[0.2em] border-gray-400 hover:border-gray-600 hover:bg-transparent text-gray-700 hover:text-gray-900 transition-all duration-300"
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
