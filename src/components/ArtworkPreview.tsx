import { Link } from "react-router-dom";
import artwork from "@/assets/artwork-2.jpg";

const ArtworkPreview = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] text-foreground">
              DISCOVER OUR ARTWORK
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-md">
              Curated collection of contemporary art pieces to elevate your space
            </p>
            <Link 
              to="/artwork"
              className="inline-block text-xs sm:text-sm tracking-[0.2em] text-foreground border-b border-foreground/30 hover:border-foreground transition-all pb-1"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
          
          <div className="order-1 lg:order-2">
            <Link to="/artwork" className="block group">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={artwork}
                  alt="Featured Artwork"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtworkPreview;
