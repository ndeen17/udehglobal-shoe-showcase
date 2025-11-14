import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean | null;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  categories: string[];
}

const ProductFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  categories 
}: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getAverageRating } = useApp();

  const updateFilter = <K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = 
    filters.category !== '' || 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 200000 ||
    filters.rating !== 0 ||
    filters.inStock !== null;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Mobile Filter Toggle */}
      <div className="block lg:hidden p-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="brutalist-body text-sm tracking-wider">
              FILTERS {hasActiveFilters && `(${Object.values(filters).filter(v => v !== null && v !== '' && v !== 0).length})`}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded || 'lg:block'} ${!isExpanded && 'hidden'} p-4 lg:p-6`}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6">
          
          {/* Sort By */}
          <div className="space-y-2">
            <label className="brutalist-body text-xs tracking-wider text-gray-600">
              SORT BY
            </label>
            <Select value={filters.sortBy} onValueChange={(value: FilterState['sortBy']) => updateFilter('sortBy', value)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price Low-High</SelectItem>
                <SelectItem value="price-high">Price High-Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="brutalist-body text-xs tracking-wider text-gray-600">
              CATEGORY
            </label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="brutalist-body text-xs tracking-wider text-gray-600">
              PRICE RANGE
            </label>
            <div className="px-2 py-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                min={0}
                max={200000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="brutalist-body text-xs text-gray-500">
                  ₦{filters.priceRange[0].toLocaleString()}
                </span>
                <span className="brutalist-body text-xs text-gray-500">
                  ₦{filters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="brutalist-body text-xs tracking-wider text-gray-600">
              MIN RATING
            </label>
            <Select 
              value={filters.rating.toString()} 
              onValueChange={(value) => updateFilter('rating', parseInt(value))}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4+ Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>3+ Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>2+ Stars</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            <label className="brutalist-body text-xs tracking-wider text-gray-600">
              AVAILABILITY
            </label>
            <Select 
              value={filters.inStock === null ? 'all' : filters.inStock ? 'in-stock' : 'out-of-stock'} 
              onValueChange={(value) => 
                updateFilter('inStock', value === 'all' ? null : value === 'in-stock')
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in-stock">In Stock Only</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="w-full h-10"
            >
              <X className="w-4 h-4 mr-2" />
              <span className="brutalist-body text-xs tracking-wider">
                CLEAR
              </span>
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="brutalist-body text-xs tracking-wider text-gray-600 mr-2">
                ACTIVE FILTERS:
              </span>
              
              {filters.category && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  onClick={() => updateFilter('category', '')}
                >
                  {filters.category}
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}
              
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200000) && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  onClick={() => updateFilter('priceRange', [0, 200000])}
                >
                  ₦{filters.priceRange[0].toLocaleString()}-₦{filters.priceRange[1].toLocaleString()}
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}
              
              {filters.rating > 0 && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  onClick={() => updateFilter('rating', 0)}
                >
                  {filters.rating}+ Stars
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}
              
              {filters.inStock !== null && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  onClick={() => updateFilter('inStock', null)}
                >
                  {filters.inStock ? 'In Stock' : 'Out of Stock'}
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;