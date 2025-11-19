import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { productsAPI } from "@/services/api";
import type { Product } from "@/types/Product";
import { useToast } from "@/components/ui/use-toast";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getProducts();
        setProducts(response.products);
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        setError(error.message || 'Failed to load products');
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

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
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="brutalist-body text-sm tracking-wide text-gray-500">
              LOADING PRODUCTS...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="brutalist-body text-sm tracking-wide text-red-500">
              {error.toUpperCase()}
            </p>
          </div>
        )}
        
        {/* High-Density Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="brutalist-body text-sm tracking-wide text-gray-500">
              NO PRODUCTS FOUND
            </p>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default ProductsSection;
