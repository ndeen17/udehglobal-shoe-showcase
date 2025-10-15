import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProductsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
