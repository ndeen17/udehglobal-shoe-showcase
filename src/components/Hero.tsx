import SearchBar from "@/components/SearchBar";

const Hero = () => {
  return (
    <section className="min-h-screen bg-background text-foreground pt-16 md:pt-20">
      <div className="grid lg:grid-cols-[45%_55%] lg:min-h-[85vh] min-h-[calc(100vh-4rem)] gap-0">
        
        {/* Left Side - Video Background */}
        <div className="relative h-[45vh] sm:h-[50vh] lg:h-[85vh] order-2 lg:order-1 overflow-hidden bg-gray-900">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover object-top"
          >
            <source src="/instaget.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right Side - Content */}
        <div className="flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-12 sm:py-16 lg:py-8 order-1 lg:order-2 bg-background">
          <div className="w-full max-w-2xl space-y-8 sm:space-y-10 lg:space-y-12">
            
            {/* Brand Name - Minimalist */}
            <div className="text-center lg:text-left space-y-3">
              <h1 className="brutalist-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-[0.2em] text-foreground leading-tight">
                UDEH GLOBAL
              </h1>
              <p className="brutalist-subheading text-[10px] sm:text-xs tracking-[0.3em] text-gray-500 uppercase">
                Premium Lifestyle Products
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
