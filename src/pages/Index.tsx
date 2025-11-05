import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ProductsSection />
      {/* Removed Features and Footer for Yeezy-style minimalism */}
    </div>
  );
};

export default Index;
