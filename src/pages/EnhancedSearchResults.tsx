import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Filter, Grid, List, X, SlidersHorizontal, 
  Star, Package, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import { productsAPI } from '@/services/api';
import type { Product } from '@/types/Product';

const EnhancedSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '100000')
  ]);
  const [minRating, setMinRating] = useState<number>(
    parseFloat(searchParams.get('minRating') || '0')
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get('inStock') === 'true'
  );
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Array<{name: string; slug: string}>>([]);
  const [availablePriceRange, setAvailablePriceRange] = useState<{minPrice: number; maxPrice: number}>({
    minPrice: 0,
    maxPrice: 100000
  });

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const data = await productsAPI.searchProducts(query, {
          page: currentPage,
          limit: 20,
          sortBy,
          category: selectedCategories.join(','),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating: minRating > 0 ? minRating : undefined,
          inStock: inStockOnly || undefined
        });

        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
        
        if (data.filters) {
          setAvailableCategories(data.filters.categories);
          if (data.filters.priceRange.maxPrice > 0) {
            setAvailablePriceRange(data.filters.priceRange);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, sortBy, currentPage, selectedCategories, priceRange, minRating, inStockOnly]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sortBy !== 'relevance') params.set('sortBy', sortBy);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 100000) params.set('maxPrice', priceRange[1].toString());
    if (minRating > 0) params.set('minRating', minRating.toString());
    if (inStockOnly) params.set('inStock', 'true');
    
    setSearchParams(params, { replace: true });
  }, [sortBy, selectedCategories, priceRange, minRating, inStockOnly]);

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FiltersPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      {availableCategories.length > 0 && (
        <div>
          <h3 className="brutalist-body text-sm tracking-wider text-foreground mb-3 font-medium">
            CATEGORIES
          </h3>
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <div key={category.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.slug}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryToggle(category.slug)}
                />
                <Label
                  htmlFor={`cat-${category.slug}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="brutalist-body text-sm tracking-wider text-foreground mb-3 font-medium">
          PRICE RANGE
        </h3>
        <div className="space-y-4">
          <Slider
            min={availablePriceRange.minPrice}
            max={availablePriceRange.maxPrice}
            step={1000}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <h3 className="brutalist-body text-sm tracking-wider text-foreground mb-3 font-medium">
          MINIMUM RATING
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors ${
                minRating === rating ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star key={i + rating} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-700">& Up</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Stock Filter */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
          />
          <Label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            CLEAR ALL FILTERS
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1} />
                <span>BACK</span>
              </Link>
            </div>
            
            <EnhancedSearchBar />
            
            {query && (
              <div className="mt-4 md:mt-6">
                <h1 className="brutalist-heading text-base md:text-xl tracking-widest text-foreground mb-2">
                  SEARCH RESULTS
                </h1>
                <p className="brutalist-body text-sm tracking-wide text-gray-500">
                  {loading ? 'Searching...' : `${total} RESULTS FOR "${query.toUpperCase()}"`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      {query && (
        <div className="border-b bg-white sticky top-[120px] z-30">
          <div className="px-4 md:px-8 py-3 md:py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {/* Mobile Filters Sheet */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="tracking-wider relative"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      FILTERS
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="tracking-widest">FILTERS</SheetTitle>
                      <SheetDescription>
                        Refine your search results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersPanel />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 tracking-wider">
                    <SelectValue placeholder="SORT BY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">RELEVANCE</SelectItem>
                    <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                    <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
                    <SelectItem value="rating">HIGHEST RATED</SelectItem>
                    <SelectItem value="newest">NEWEST FIRST</SelectItem>
                    <SelectItem value="name">NAME: A TO Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedCategories.map((slug) => {
                      const category = availableCategories.find(c => c.slug === slug);
                      return category ? (
                        <Badge
                          key={slug}
                          variant="secondary"
                          className="gap-1"
                        >
                          {category.name}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => handleCategoryToggle(slug)}
                          />
                        </Badge>
                      ) : null;
                    })}
                    {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                      <Badge variant="secondary" className="gap-1">
                        ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setPriceRange([0, 100000])}
                        />
                      </Badge>
                    )}
                    {minRating > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {minRating}+ Stars
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setMinRating(0)}
                        />
                      </Badge>
                    )}
                    {inStockOnly && (
                      <Badge variant="secondary" className="gap-1">
                        In Stock
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setInStockOnly(false)}
                        />
                      </Badge>
                    )}
                  </div>
                )}
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

      {/* Results */}
      <div className="px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length === 0 && query ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="brutalist-heading text-xl tracking-widest text-foreground mb-4">
                NO RESULTS FOUND
              </h2>
              <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-8">
                Try different keywords or adjust your filters
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handleClearFilters}>
                  CLEAR FILTERS
                </Button>
                <Link to="/">
                  <Button>
                    BROWSE CATEGORIES
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/item/${product.slug}`}
                      className="group"
                    >
                      <Card className="border-0 shadow-none hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 overflow-hidden mb-4 relative">
                          {typeof product.images[0] === 'string' ? (
                            <img 
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <img 
                              src={product.images[0]?.url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          {product.stockQuantity === 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs tracking-wider">OUT OF STOCK</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="brutalist-body text-sm tracking-wide text-foreground line-clamp-2">
                            {product.name}
                          </h3>
                          {product.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">
                                {product.averageRating.toFixed(1)} ({product.reviewCount})
                              </span>
                            </div>
                          )}
                          <p className="brutalist-body text-base tracking-wider text-foreground font-medium">
                            ₦{product.price.toLocaleString()}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/item/${product.slug}`}
                      className="group"
                    >
                      <Card className="border shadow-none hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                            {typeof product.images[0] === 'string' ? (
                              <img 
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <img 
                                src={product.images[0]?.url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="brutalist-body text-base tracking-wide text-foreground mb-2">
                              {product.name}
                            </h3>
                            <p className="brutalist-body text-sm tracking-wide text-gray-500 line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            {product.averageRating > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600">
                                    {product.averageRating.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-400">
                                  ({product.reviewCount} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="brutalist-body text-lg md:text-xl tracking-wider text-foreground font-medium mb-2">
                              ₦{product.price.toLocaleString()}
                            </p>
                            {product.stockQuantity > 0 ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Check className="w-3 h-3 mr-1" />
                                IN STOCK
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-red-100 text-red-800">
                                OUT OF STOCK
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage} of {pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === pages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchResults;
