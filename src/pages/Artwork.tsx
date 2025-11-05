import Navigation from "@/components/Navigation";
import ArtworkCard from "@/components/ArtworkCard";
import Footer from "@/components/Footer";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";
import artwork6 from "@/assets/artwork-6.jpg";
import artwork7 from "@/assets/artwork-7.jpg";
import artwork8 from "@/assets/artwork-8.jpg";
import artwork9 from "@/assets/artwork-9.jpg";

const artworks = [
  { id: 1, image: artwork1, title: "Abstract Composition I", price: "₦700,000" },
  { id: 2, image: artwork2, title: "Portrait Series", price: "₦700,000" },
  { id: 3, image: artwork3, title: "Nature Study", price: "₦700,000" },
  { id: 4, image: artwork4, title: "Urban Abstract", price: "₦700,000" },
  { id: 5, image: artwork5, title: "Circular Motion", price: "₦700,000" },
  { id: 6, image: artwork6, title: "Contrast Study", price: "₦700,000" },
  { id: 7, image: artwork7, title: "Geometric Expression", price: "₦700,000" },
  { id: 8, image: artwork8, title: "Contemporary Fashion", price: "₦700,000" },
  { id: 9, image: artwork9, title: "Desert Landscape", price: "₦700,000" },
];

const Artwork = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-16 sm:pt-20">
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em] text-foreground">
                ARTWORK COLLECTION
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light max-w-2xl mx-auto">
                Contemporary pieces curated for refined spaces
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 animate-fade-in">
              {artworks.map((artwork) => (
                <ArtworkCard 
                  key={artwork.id}
                  image={artwork.image}
                  title={artwork.title}
                  price={artwork.price}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Artwork;
