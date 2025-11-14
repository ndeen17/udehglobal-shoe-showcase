import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory, getAllProducts, getActiveCategories } from '@/data/categories';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import { useApp } from '@/contexts/AppContext';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getAverageRating } = useApp();
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: slug || '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: null,
    sortBy: 'name'
  });

  // Get all categories for filter dropdown
  const allCategories = getActiveCategories().map(cat => cat.slug);
  
  // Get products based on current slug, or all products if viewing all categories
  const baseProducts = !slug || slug === 'all' 
    ? getAllProducts()
    : getProductsByCategory(slug);
  
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Apply category filter
    if (filters.category && filters.category !== slug) {
      result = getAllProducts().filter(p => p.category === filters.category);
    }

    // Apply price filter
    result = result.filter(p => {
      const price = parseFloat(p.price.replace('$', ''));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter(p => getAverageRating(p.id) >= filters.rating);
    }

    // Apply stock filter
    if (filters.inStock !== null) {
      result = result.filter(p => p.inStock === filters.inStock);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
        case 'price-high':
          return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
        case 'rating':
          return getAverageRating(b.id) - getAverageRating(a.id);
        case 'newest':
          return b.id - a.id; // Assuming higher ID means newer
        default:
          return 0;
      }
    });

    return result;
  }, [baseProducts, filters, getAverageRating, slug]);

  const clearFilters = () => {
    setFilters({
      category: slug || '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: null,
      sortBy: 'name'
    });
  };
  
  const category = slug ? getCategoryBySlug(slug) : null;

  if (!category && slug) {
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
            {category?.name || 'ALL PRODUCTS'}
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-2">
            {category?.description || 'Browse all available products'}
          </p>
          <p className="brutalist-body text-xs tracking-wide text-gray-400">
            {filteredProducts.length} PRODUCTS AVAILABLE
          </p>
        </div>

        {/* Product Filters */}
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          categories={allCategories}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/item/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="block group"
                >
                  <div className="bg-background">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="brutalist-body text-xs text-gray-400 text-center p-4">
                            {product.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      )}
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