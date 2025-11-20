import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCartCount } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { Plus, User, Clock, ShoppingBag, LogOut, Settings, Heart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NavigationOverlay from './NavigationOverlay';

const GlobalHeader = () => {
  const { toggleNav, wishlistCount } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = useCartCount();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background border-0">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
          
          {/* Left: Hamburger/Plus Icon */}
          <button
            onClick={toggleNav}
            className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open navigation"
          >
            <Plus 
              className="w-6 h-6 md:w-5 md:h-5 text-foreground" 
              strokeWidth={1}
            />
          </button>

          {/* Center: Utility Icons */}
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Account/User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <User 
                      className="w-5 h-5 md:w-4 md:h-4 text-foreground" 
                      strokeWidth={1}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <div className="px-2 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center space-x-2 w-full">
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center space-x-2 w-full">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="flex items-center space-x-2 w-full">
                      <Clock className="w-4 h-4" />
                      <span>Order History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 w-full text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/login" 
                className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Sign In"
              >
                <User 
                  className="w-5 h-5 md:w-4 md:h-4 text-foreground" 
                  strokeWidth={1}
                />
              </Link>
            )}
            
            <Link 
              to="/history" 
              className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] hidden sm:flex items-center justify-center"
              aria-label="History"
            >
              <Clock 
                className="w-5 h-5 md:w-4 md:h-4 text-foreground" 
                strokeWidth={1}
              />
            </Link>
            
            {/* Wishlist Icon with Count */}
            <Link 
              to="/wishlist" 
              className="relative p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart 
                className="w-5 h-5 md:w-4 md:h-4 text-foreground" 
                strokeWidth={1}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center brutalist-body text-[10px]">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            
            <Link 
              to="/info" 
              className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] hidden md:flex items-center justify-center"
              aria-label="Information"
            >
              <ShoppingBag 
                className="w-5 h-5 md:w-4 md:h-4 text-foreground" 
                strokeWidth={1}
              />
            </Link>
          </div>

          {/* Right: Cart Icon with Count */}
          <Link 
            to="/cart" 
            className="relative p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingBag 
              className="w-6 h-6 md:w-5 md:h-5 text-foreground" 
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