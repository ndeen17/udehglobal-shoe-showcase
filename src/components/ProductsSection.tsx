import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, image: product1, title: "Premium Comfort Slides - Multi Color", price: "₦15,000" },
  { id: 2, image: product2, title: "Classic Black Slides", price: "₦15,000" },
  { id: 3, image: product3, title: "Sport White Slides", price: "₦15,000" },
  { id: 4, image: product4, title: "Navy Blue Comfort Slides", price: "₦15,000" },
  { id: 5, image: product5, title: "Designer Black Slides", price: "₦15,000" },
  { id: 6, image: product6, title: "Flip Flop Style Slides", price: "₦15,000" },
];

const ProductsSection = () => {
  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em] text-foreground">COLLECTION</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 animate-fade-in">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
