import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ArtworkPreview from "@/components/ArtworkPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProductsSection />
      <FeaturesSection />
      <ArtworkPreview />
      <Footer />
    </div>
  );
};

export default Index;
