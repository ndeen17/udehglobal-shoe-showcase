import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, image: product1, title: "Premium Comfort Slides - Multi Color", price: "₦15,000", category: "Shoes" },
  { id: 2, image: product2, title: "Classic Black Slides", price: "₦15,000", category: "Shoes" },
  { id: 3, image: product3, title: "Sport White Slides", price: "₦15,000", category: "Shoes" },
  { id: 4, image: product4, title: "Navy Blue Comfort Slides", price: "₦15,000", category: "Shoes" },
  { id: 5, image: product5, title: "Designer Black Slides", price: "₦15,000", category: "Shoes" },
  { id: 6, image: product6, title: "Flip Flop Style Slides", price: "₦15,000", category: "Shoes" },
];

const ProductsSection = () => {
  return (
    <section id="products" className="bg-background">
      {/* Yeezy-Style High-Density Grid */}
      <div className="px-8 pb-32">
        
        {/* Minimal Section Header */}
        <div className="text-center mb-16">
          <h2 className="brutalist-subheading text-lg tracking-widest text-foreground">
            PRODUCTS
          </h2>
        </div>
        
        {/* High-Density Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              category={product.category}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ProductsSection;
