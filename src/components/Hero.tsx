import SearchBar from "@/components/SearchBar";

const Hero = () => {
  return (
    <section className="min-h-screen bg-background text-foreground pt-16 md:pt-20">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        
        {/* Left Side - Portrait Image */}
        <div className="relative h-[40vh] sm:h-[50vh] lg:h-full order-2 lg:order-1">
          <img 
            src="/sofi.png" 
            alt="UDEH Global" 
            className="w-full h-full object-cover object-center grayscale"
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 order-1 lg:order-2">
          <div className="w-full max-w-xl space-y-6 sm:space-y-8 md:space-y-12">
            
            {/* Brand Name - Minimalist */}
            <div className="text-center lg:text-left">
              <h1 className="brutalist-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-widest text-foreground leading-none mb-2 sm:mb-3">
                UDEH GLOBAL
              </h1>
              <p className="brutalist-subheading text-xs sm:text-sm tracking-wider text-gray-500">
                PREMIUM LIFESTYLE PRODUCTS
              </p>
            </div>

            {/* Search Bar */}
            <div>
              <SearchBar />
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
