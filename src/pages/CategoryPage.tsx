import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory } from '@/data/categories';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <div>Category not found</div>;
  }
  
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="text-center pt-32">
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
            CATEGORY NOT FOUND
          </h1>
          <Link 
            to="/"
            className="brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      
      {/* Back Navigation */}
      <div className="px-8 pt-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Category Header */}
      <div className="px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="brutalist-heading text-2xl tracking-widest text-foreground mb-4">
            {category.name}
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-2">
            {category.description}
          </p>
          <p className="brutalist-body text-xs tracking-wide text-gray-400">
            {products.length} PRODUCTS AVAILABLE
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/item/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="block group"
                >
                  <div className="bg-background">
                    {/* Product Image Placeholder */}
                    <div className="aspect-square bg-gray-100 overflow-hidden mb-4 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="brutalist-body text-xs text-gray-400 text-center p-4">
                          {product.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-center space-y-2">
                      <h3 className="brutalist-body text-xs tracking-wider text-foreground group-hover:text-gray-500 transition-colors duration-300 line-clamp-2">
                        {product.name.toUpperCase()}
                      </h3>
                      <p className="brutalist-body text-xs tracking-wide text-gray-500">
                        {product.price}
                      </p>
                      {!product.inStock && (
                        <p className="brutalist-body text-xs tracking-wide text-red-500">
                          OUT OF STOCK
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="brutalist-body text-sm tracking-wide text-gray-500">
              COMING SOON
            </p>
            <p className="brutalist-body text-xs tracking-wide text-gray-400 mt-2">
              Products will be added to this category shortly
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;