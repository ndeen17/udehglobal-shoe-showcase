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
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Our Collection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover premium quality slides designed for ultimate comfort and style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
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
