import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { productsAPI, categoriesAPI } from '@/services/api';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ProductCard from '@/components/ProductCard';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 200000] as [number, number],
    search: '',
    sortBy: 'newest',
    inStock: false,
  });

  // Load data on component mount and when slug changes
  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories - filter only active ones for storefront
      const categoriesData = await categoriesAPI.getCategories();
      const activeCategories = categoriesData.filter(cat => cat.isActive);
      setCategories(activeCategories);

      if (slug && slug !== 'all') {
        try {
          // Load specific category and its products
          const categoryData = await categoriesAPI.getCategoryBySlug(slug);
          setCategory(categoryData);
          
          const productsData = await categoriesAPI.getProductsByCategory(slug, {
            sortBy: filters.sortBy,
            page: 1,
            limit: 50
          });
          setProducts(productsData.products || []);
        } catch (categoryError) {
          console.error('Category not found:', categoryError);
          const productsData = await productsAPI.getProducts({
            sortBy: filters.sortBy,
            page: 1,
            limit: 50
          });
          setProducts(productsData.products || []);
          setCategory(null);
        }
      } else {
        // Load all products
        const productsData = await productsAPI.getProducts({
          sortBy: filters.sortBy,
          page: 1,
          limit: 50
        });
        setProducts(productsData.products || []);
        setCategory(null);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load products');
      setProducts([]);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Stock filter
    if (filters.inStock && !product.stockQuantity) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200000],
      search: '',
      sortBy: 'newest',
      inStock: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="text-center pt-32">
          <Package className="w-8 h-8 mx-auto mb-4 animate-pulse text-gray-400" />
          <p className="brutalist-body text-sm tracking-wider text-gray-500">
            LOADING PRODUCTS...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="text-center pt-32">
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
            ERROR LOADING PRODUCTS
          </h1>
          <p className="brutalist-body text-sm tracking-wider text-gray-500 mb-4">
            {error}
          </p>
          <Button onClick={loadData} variant="outline">
            TRY AGAIN
          </Button>
        </div>
      </div>
    );
  }

  if (!category && slug && slug !== 'all') {
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

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div>
              <Label className="brutalist-body text-xs tracking-wider text-gray-600 mb-2">
                SEARCH
              </Label>
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="text-xs"
              />
            </div>

            {/* Sort */}
            <div>
              <Label className="brutalist-body text-xs tracking-wider text-gray-600 mb-2">
                SORT BY
              </Label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price Low-High</SelectItem>
                  <SelectItem value="price-high">Price High-Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <Label className="brutalist-body text-xs tracking-wider text-gray-600 mb-2">
                PRICE RANGE
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                min={0}
                max={200000}
                step={5000}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">₦{filters.priceRange[0].toLocaleString()}</span>
                <span className="text-xs text-gray-500">₦{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: !!checked }))}
              />
              <Label htmlFor="inStock" className="brutalist-body text-xs tracking-wider text-gray-600">
                IN STOCK ONLY
              </Label>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              CLEAR FILTERS
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="brutalist-body text-sm tracking-wide text-gray-500">
              {products.length === 0 ? 'COMING SOON' : 'NO PRODUCTS MATCH YOUR FILTERS'}
            </p>
            <p className="brutalist-body text-xs tracking-wide text-gray-400 mt-2">
              {products.length === 0 
                ? 'Products will be added to this category shortly' 
                : 'Try adjusting your filter criteria'
              }
            </p>
            {products.length > 0 && filteredProducts.length === 0 && (
              <Button 
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                CLEAR ALL FILTERS
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
