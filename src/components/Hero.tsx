import logo from "@/assets/logo.png";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-background text-foreground pt-20">
      {/* Brutalist Minimal Content */}
      <div className="flex items-center justify-center min-h-[80vh] px-8">
        <div className="w-full max-w-4xl text-center">
          
          {/* Main Brand Statement - Yeezy Style */}
          <div className="space-y-16">
            <h1 className="brutalist-heading text-6xl md:text-8xl tracking-widest text-foreground leading-none">
              UDEH GLOBAL
            </h1>
            
            <h2 className="brutalist-subheading text-sm tracking-wider text-gray-500">
              PREMIUM COMFORT SLIDES
            </h2>
          </div>

          {/* Minimal CTA */}
          <div className="mt-32">
            <button 
              onClick={scrollToProducts}
              className="brutalist-body text-xs tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 bg-transparent border-0 p-0"
            >
              VIEW
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
