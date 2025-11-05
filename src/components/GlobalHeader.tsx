import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { Plus, User, Clock, ShoppingBag } from 'lucide-react';
import NavigationOverlay from './NavigationOverlay';

const GlobalHeader = () => {
  const { cartCount, toggleNav } = useApp();

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background border-0">
        <div className="flex items-center justify-between px-8 py-4">
          
          {/* Left: Hamburger/Plus Icon */}
          <button
            onClick={toggleNav}
            className="p-2 hover:bg-transparent transition-none"
            aria-label="Open navigation"
          >
            <Plus 
              className="w-5 h-5 text-foreground" 
              strokeWidth={1}
            />
          </button>

          {/* Center: Utility Icons */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/account" 
              className="p-2 hover:bg-transparent transition-none"
              aria-label="Account"
            >
              <User 
                className="w-4 h-4 text-foreground" 
                strokeWidth={1}
              />
            </Link>
            
            <Link 
              to="/history" 
              className="p-2 hover:bg-transparent transition-none"
              aria-label="History"
            >
              <Clock 
                className="w-4 h-4 text-foreground" 
                strokeWidth={1}
              />
            </Link>
            
            <Link 
              to="/info" 
              className="p-2 hover:bg-transparent transition-none"
              aria-label="Information"
            >
              <ShoppingBag 
                className="w-4 h-4 text-foreground" 
                strokeWidth={1}
              />
            </Link>
          </div>

          {/* Right: Cart Icon with Count */}
          <Link 
            to="/cart" 
            className="relative p-2 hover:bg-transparent transition-none"
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingBag 
              className="w-5 h-5 text-foreground" 
              strokeWidth={1}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-none flex items-center justify-center brutalist-body">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Navigation Overlay */}
      <NavigationOverlay />
    </>
  );
};

export default GlobalHeader;