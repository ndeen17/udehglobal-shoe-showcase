import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getActiveCategories, getProductsByCategory } from '@/data/categories';

const ProductCategories = () => {
  const categories = getActiveCategories();

  return (
    <section id="products" className="bg-background py-8">
      <div className="px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="brutalist-subheading text-lg tracking-widest text-foreground mb-4">
            CATEGORIES
          </h2>
          <p className="brutalist-body text-xs tracking-wide text-gray-500">
            SELECT A CATEGORY TO EXPLORE
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {categories.map((category) => {
              const productCount = getProductsByCategory(category.slug).length;
              
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group block"
                >
                  {/* Category Card */}
                  <div className="bg-background border-0 hover:bg-gray-50 transition-colors duration-300">
                    
                    {/* Image Container */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300 overflow-hidden">
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Category Info */}
                    <div className="text-center space-y-2">
                      <h3 className="brutalist-body text-sm tracking-wider text-foreground group-hover:text-gray-500 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="brutalist-body text-xs tracking-wide text-gray-500">
                        {category.description}
                      </p>
                      <p className="brutalist-body text-xs tracking-wide text-gray-400">
                        {productCount} ITEMS
                      </p>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        
      </div>
    </section>
  );
};

export default ProductCategories;