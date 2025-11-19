import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Package, 
  Palette, 
  Car, 
  ShoppingBag, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Dumbbell,
  Home,
  Sparkles,
  Baby,
  Trophy,
  BookOpen,
  Gamepad2,
  Hammer,
  PenTool,
  Settings,
  Watch
} from 'lucide-react';
import { categoriesAPI } from '@/services/api';
import { Category } from '@/types/Category';
import { useToast } from '@/components/ui/use-toast';

// Icon mapping for categories
const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Palette': Palette,
  'Car': Car,
  'ShoppingBag': ShoppingBag,
  'Smartphone': Smartphone,
  'Laptop': Laptop,
  'Shirt': Shirt,
  'Dumbbell': Dumbbell,
  'Home': Home,
  'Sparkles': Sparkles,
  'Baby': Baby,
  'Trophy': Trophy,
  'BookOpen': BookOpen,
  'Gamepad2': Gamepad2,
  'Hammer': Hammer,
  'PenTool': PenTool,
  'Settings': Settings,
  'Watch': Watch,
  'Package': Package
};

const ProductCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Auto-retry on error with exponential backoff
    if (error && retryCount < 3) {
      const timeout = setTimeout(() => {
        console.log(`Retrying to load categories... Attempt ${retryCount + 1}`);
        loadCategories();
      }, Math.min(1000 * Math.pow(2, retryCount), 10000)); // Max 10 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [error, retryCount]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const categoriesData = await categoriesAPI.getCategories();
      
      // Filter only active categories for storefront
      const activeCategories = categoriesData
        .filter(cat => cat.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      
      setCategories(activeCategories);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError(true);
      setRetryCount(prev => prev + 1);
      
      if (retryCount >= 2) {
        toast({
          title: 'Connection Error',
          description: 'Unable to load categories. Please check your connection.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="products" className="bg-background py-8 md:py-12">
      <div className="px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="brutalist-subheading text-base md:text-lg tracking-widest text-foreground mb-4">
            CATEGORIES
          </h2>
          <p className="brutalist-body text-xs tracking-wide text-gray-500">
            SELECT A CATEGORY TO EXPLORE
          </p>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-8 w-8 text-gray-400 animate-pulse mb-2" />
            <p className="text-sm text-gray-500">Loading categories...</p>
            {retryCount > 0 && (
              <p className="text-xs text-gray-400 mt-1">Retry attempt {retryCount}/3</p>
            )}
          </div>
        ) : error && categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Unable to load categories</p>
            <button 
              onClick={() => { setRetryCount(0); loadCategories(); }}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Try again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No active categories available</p>
          </div>
        ) : (
          /* Categories Grid */
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
              {categories.map((category) => {
                const IconComponent = iconMap[category.iconName || 'Package'] || Package;
                
                return (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="group block"
                >
                  {/* Category Card */}
                  <div className="bg-background border-0 hover:bg-gray-50 transition-colors duration-300">
                    
                    {/* Icon Container */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                      <IconComponent 
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                        strokeWidth={1}
                      />
                    </div>
                    
                    {/* Category Info */}
                    <div className="text-center space-y-1 md:space-y-2">
                      <h3 className="brutalist-body text-xs sm:text-sm tracking-wider text-foreground group-hover:text-gray-500 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="brutalist-body text-[10px] sm:text-xs tracking-wide text-gray-500 hidden sm:block">
                        {category.description}
                      </p>
                      <p className="brutalist-body text-[10px] sm:text-xs tracking-wide text-gray-400">
                        VIEW PRODUCTS
                      </p>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="flex justify-center mt-2 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight 
                        className="w-4 h-4 text-foreground" 
                        strokeWidth={1}
                      />
                    </div>
                    
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default ProductCategories;