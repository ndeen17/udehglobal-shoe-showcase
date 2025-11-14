import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getAllProducts } from '@/data/categories';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  slug: string;
}

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allProducts = getAllProducts();

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = allProducts
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
        .map(product => ({
          ...product,
          slug: product.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }));
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selectedProduct = results[selectedIndex];
      if (selectedProduct) {
        window.location.href = `/product/${selectedProduct.slug}`;
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SEARCH PRODUCTS..."
          className="w-full bg-white border border-gray-200 pl-12 pr-12 py-4 brutalist-body text-sm tracking-wider focus:outline-none focus:border-gray-400 transition-colors"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 z-50 max-h-96 overflow-y-auto">
          {results.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index ? 'bg-gray-50' : ''
              }`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
                onClose?.();
              }}
            >
              <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="brutalist-body text-sm tracking-wide text-foreground truncate">
                  {product.name}
                </h4>
                <p className="brutalist-body text-xs tracking-wide text-gray-500 uppercase">
                  {product.category}
                </p>
              </div>
              <div className="text-right">
                <span className="brutalist-body text-sm tracking-wider text-foreground">
                  {product.price}
                </span>
              </div>
            </Link>
          ))}
          
          {/* View All Results */}
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            className="block p-4 text-center hover:bg-gray-50 transition-colors border-t border-gray-200"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              onClose?.();
            }}
          >
            <span className="brutalist-body text-xs tracking-widest text-gray-500">
              VIEW ALL RESULTS FOR "{query.toUpperCase()}"
            </span>
          </Link>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 z-50 p-8 text-center">
          <p className="brutalist-body text-sm tracking-wider text-gray-500">
            NO PRODUCTS FOUND FOR "{query.toUpperCase()}"
          </p>
          <p className="brutalist-body text-xs tracking-wide text-gray-400 mt-2">
            TRY DIFFERENT KEYWORDS
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;