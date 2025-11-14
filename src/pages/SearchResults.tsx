import { useSearchParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllProducts } from '@/data/categories';
import SearchBar from '@/components/SearchBar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = getAllProducts();

  const searchResults = useMemo(() => {
    if (!query.trim()) return allProducts;
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  const sortedResults = useMemo(() => {
    const results = [...searchResults];
    
    switch (sortBy) {
      case 'price-low':
        return results.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
      case 'price-high':
        return results.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
      case 'name':
        return results.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return results;
    }
  }, [searchResults, sortBy]);

  const categories = useMemo(() => {
    const cats = new Set(searchResults.map(p => p.category));
    return Array.from(cats);
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <div className="border-b bg-white">
        <div className="px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1} />
                <span>BACK</span>
              </Link>
            </div>
            
            <SearchBar />
            
            {query && (
              <div className="mt-6">
                <h1 className="brutalist-heading text-xl tracking-widest text-foreground mb-2">
                  SEARCH RESULTS
                </h1>
                <p className="brutalist-body text-sm tracking-wide text-gray-500">
                  {searchResults.length} RESULTS FOR "{query.toUpperCase()}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      {searchResults.length > 0 && (
        <div className="border-b">
          <div className="px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="tracking-wider"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  FILTERS
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 tracking-wider">
                    <SelectValue placeholder="SORT BY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">RELEVANCE</SelectItem>
                    <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                    <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
                    <SelectItem value="name">NAME: A TO Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && categories.length > 1 && (
        <div className="border-b bg-gray-50">
          <div className="px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <h3 className="brutalist-body text-sm tracking-wider text-foreground mb-4">
                CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {category.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {searchResults.length === 0 && query ? (
            <div className="text-center py-16">
              <h2 className="brutalist-heading text-xl tracking-widest text-foreground mb-4">
                NO RESULTS FOUND
              </h2>
              <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-8">
                TRY DIFFERENT KEYWORDS OR BROWSE OUR CATEGORIES
              </p>
              <Link to="/">
                <Button variant="outline">
                  BROWSE CATEGORIES
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {sortedResults.map((product) => {
                    const productSlug = product.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    
                    return (
                      <Link
                        key={product.id}
                        to={`/product/${productSlug}`}
                        className="group"
                      >
                        <Card className="border-0 shadow-none hover:shadow-sm transition-shadow">
                          <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.category.toUpperCase()}
                            </Badge>
                            <h3 className="brutalist-body text-sm tracking-wide text-foreground">
                              {product.name}
                            </h3>
                            <p className="brutalist-body text-xs tracking-wider text-foreground">
                              {product.price}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {sortedResults.map((product) => {
                    const productSlug = product.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    
                    return (
                      <Link
                        key={product.id}
                        to={`/product/${productSlug}`}
                        className="group"
                      >
                        <Card className="border shadow-none hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-6 p-6">
                            <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                              <img 
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge variant="secondary" className="text-xs mb-2">
                                {product.category.toUpperCase()}
                              </Badge>
                              <h3 className="brutalist-body text-base tracking-wide text-foreground mb-2">
                                {product.name}
                              </h3>
                              <p className="brutalist-body text-sm tracking-wide text-gray-500">
                                {product.description || 'Premium quality product'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="brutalist-body text-lg tracking-wider text-foreground">
                                {product.price}
                              </p>
                              {product.inStock !== false && (
                                <Badge variant="default" className="bg-green-100 text-green-800 mt-2">
                                  IN STOCK
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;