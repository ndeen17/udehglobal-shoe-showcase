import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Tag, Package, ArrowRight } from 'lucide-react';
import { productsAPI } from '@/services/api';
import { searchHistoryService } from '@/services/searchHistoryService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '../hooks/useDebounce';

interface SearchSuggestion {
  type: 'product' | 'category' | 'tag';
  text: string;
  value: string;
}

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

const EnhancedSearchBar: React.FC<SearchBarProps> = ({ onClose, autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    products: SearchSuggestion[];
    categories: SearchSuggestion[];
    tags: SearchSuggestion[];
  }>({products: [], categories: [], tags: []});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Debounce search query for API calls
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(searchHistoryService.getRecentSearches(5));
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length >= 2) {
        setLoading(true);
        try {
          const data = await productsAPI.getSearchSuggestions(debouncedQuery, 6);
          setSuggestions({
            products: data.products as SearchSuggestion[],
            categories: data.categories as SearchSuggestion[],
            tags: data.tags as SearchSuggestion[]
          });
          setIsOpen(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions({ products: [], categories: [], tags: [] });
        } finally {
          setLoading(false);
        }
      } else if (debouncedQuery.trim().length === 0) {
        setSuggestions({ products: [], categories: [], tags: [] });
        if (recentSearches.length > 0) {
          setIsOpen(true);
        }
      } else {
        setSuggestions({ products: [], categories: [], tags: [] });
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    };

    fetchSuggestions();
  }, [debouncedQuery, recentSearches.length]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // All selectable items
  const allItems = useMemo(() => {
    const items: Array<{type: string; text: string; value: string}> = [];
    
    if (query.trim().length === 0 && recentSearches.length > 0) {
      return recentSearches.map(search => ({ type: 'recent', text: search, value: search }));
    }
    
    if (suggestions.products.length > 0) items.push(...suggestions.products);
    if (suggestions.categories.length > 0) items.push(...suggestions.categories);
    if (suggestions.tags.length > 0) items.push(...suggestions.tags);
    
    return items;
  }, [query, suggestions, recentSearches]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        handleSelectItem(allItems[selectedIndex]);
      } else if (query.trim()) {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    searchHistoryService.addToHistory(searchQuery);
    setRecentSearches(searchHistoryService.getRecentSearches(5));
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleSelectItem = (item: { type: string; text: string; value: string }) => {
    if (item.type === 'recent') {
      setQuery(item.text);
      handleSearch(item.text);
    } else if (item.type === 'category') {
      navigate(`/category/${item.value}`);
      setIsOpen(false);
      setQuery('');
      onClose?.();
    } else {
      setQuery(item.text);
      handleSearch(item.text);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions({ products: [], categories: [], tags: [] });
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    searchHistoryService.removeFromHistory(search);
    setRecentSearches(searchHistoryService.getRecentSearches(5));
  };

  const handleClearHistory = () => {
    searchHistoryService.clearHistory();
    setRecentSearches([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4 text-gray-400" />;
      case 'category':
        return <Tag className="w-4 h-4 text-blue-500" />;
      case 'tag':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const hasSuggestions = suggestions.products.length > 0 || 
                        suggestions.categories.length > 0 || 
                        suggestions.tags.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="SEARCH PRODUCTS, CATEGORIES..."
          className="w-full bg-white border border-gray-200 pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 brutalist-body text-sm tracking-wider focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all mobile-input rounded-sm"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {loading && (
          <div className="absolute right-12 md:right-16 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 z-50 max-h-[70vh] md:max-h-[500px] overflow-y-auto smooth-scroll shadow-lg mt-0">
          
          {/* Recent Searches */}
          {query.trim().length === 0 && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="brutalist-body text-xs tracking-widest text-gray-500 uppercase">
                  Recent Searches
                </h3>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600 tracking-wide"
                >
                  CLEAR ALL
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectItem({ type: 'recent', text: search, value: search })}
                    className={`w-full flex items-center justify-between gap-3 p-3 hover:bg-gray-50 transition-colors rounded min-h-[48px] ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="brutalist-body text-sm tracking-wide text-gray-700">
                        {search}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveRecentSearch(search, e)}
                      className="p-1 hover:bg-gray-200 rounded"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {query.trim().length >= 2 && hasSuggestions && (
            <div className="p-4">
              {/* Products */}
              {suggestions.products.length > 0 && (
                <div className="mb-4">
                  <h3 className="brutalist-body text-xs tracking-widest text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Package className="w-3 h-3" />
                    Products
                  </h3>
                  <div className="space-y-1">
                    {suggestions.products.map((item, index) => (
                      <button
                        key={`product-${index}`}
                        onClick={() => handleSelectItem(item)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded min-h-[48px] ${
                          selectedIndex === index ? 'bg-gray-50' : ''
                        }`}
                      >
                        {getIcon(item.type)}
                        <span className="brutalist-body text-sm tracking-wide text-gray-700 text-left flex-1">
                          {item.text}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {suggestions.categories.length > 0 && (
                <div className="mb-4">
                  <h3 className="brutalist-body text-xs tracking-widest text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.categories.map((item, index) => (
                      <Badge
                        key={`category-${index}`}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                        onClick={() => handleSelectItem(item)}
                      >
                        {item.text}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {suggestions.tags.length > 0 && (
                <div>
                  <h3 className="brutalist-body text-xs tracking-widest text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags.map((item, index) => (
                      <Badge
                        key={`tag-${index}`}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => handleSelectItem(item)}
                      >
                        {item.text}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View All Results */}
          {query.trim().length >= 2 && (
            <>
              <Separator />
              <Link
                to={`/search?q=${encodeURIComponent(query)}`}
                className="block p-4 text-center hover:bg-gray-50 transition-colors min-h-[56px] flex items-center justify-center"
                onClick={() => {
                  handleSearch(query);
                }}
              >
                <span className="brutalist-body text-xs tracking-widest text-gray-500 flex items-center gap-2">
                  VIEW ALL RESULTS FOR "{query.toUpperCase()}"
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </>
          )}

          {/* No Results */}
          {query.trim().length >= 2 && !loading && !hasSuggestions && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="brutalist-body text-sm tracking-wider text-gray-500 mb-2">
                NO SUGGESTIONS FOUND
              </p>
              <p className="brutalist-body text-xs tracking-wide text-gray-400">
                Try different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
