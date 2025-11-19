import logo from "@/assets/logo.png";
import SearchBar from "@/components/SearchBar";

const Hero = () => {
  return (
    <section className="min-h-screen bg-background text-foreground pt-16 md:pt-20">
      {/* Brutalist Minimal Content */}
      <div className="flex items-center justify-center min-h-[50vh] px-4 md:px-8">
        <div className="w-full max-w-4xl text-center">
          
          {/* Main Brand Statement - Yeezy Style */}
          <div className="space-y-8 md:space-y-16">
            <h1 className="brutalist-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-widest text-foreground leading-none">
              UDEH GLOBAL
            </h1>
            
            <h2 className="brutalist-subheading text-xs sm:text-sm tracking-wider text-gray-500">
              PREMIUM LIFESTYLE PRODUCTS
            </h2>

            {/* Search Bar */}
            <div className="mt-8 md:mt-12">
              <SearchBar />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
