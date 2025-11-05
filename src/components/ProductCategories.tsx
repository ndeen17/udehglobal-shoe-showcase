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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const productCount = getProductsByCategory(category.slug).length;
              
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group block"
                >
                  {/* Category Card */}
                  <div className="bg-background border-0 hover:bg-gray-50 transition-colors duration-300">
                    
                    {/* Icon Container */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                      <IconComponent 
                        className="w-12 h-12 text-foreground" 
                        strokeWidth={1}
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