import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const NavigationOverlay = () => {
  const { isNavOpen, closeNav } = useApp();

  if (!isNavOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background">
      {/* Close Button */}
      <div className="absolute top-0 right-0 p-4 md:p-8">
        <button
          onClick={closeNav}
          className="p-2 hover:bg-transparent transition-none min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close navigation"
        >
          <X 
            className="w-6 h-6 md:w-5 md:h-5 text-foreground" 
            strokeWidth={1}
          />
        </button>
      </div>

      {/* Navigation Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <nav className="text-center space-y-12 md:space-y-16">
          
          {/* Main Brand */}
          <div className="mb-16 md:mb-24">
            <Link 
              to="/" 
              onClick={closeNav}
              className="block"
            >
              <h1 className="brutalist-heading text-4xl sm:text-5xl md:text-6xl tracking-wider text-foreground hover:text-gray-500 transition-colors duration-300">
                UDEH GLOBAL
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6 md:space-y-8">
            <Link
              to="/products"
              onClick={closeNav}
              className="block brutalist-subheading text-base md:text-lg tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 py-2"
            >
              PRODUCTS
            </Link>
            
            <Link
              to="/about"
              onClick={closeNav}
              className="block brutalist-subheading text-base md:text-lg tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 py-2"
            >
              ABOUT
            </Link>
            
            <Link
              to="/contact"
              onClick={closeNav}
              className="block brutalist-subheading text-base md:text-lg tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 py-2"
            >
              CONTACT
            </Link>
            
            <Link
              to="/info"
              onClick={closeNav}
              className="block brutalist-subheading text-base md:text-lg tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 py-2"
            >
              INFO
            </Link>
          </div>

          {/* Secondary Links */}
          <div className="pt-12 md:pt-16 space-y-3 md:space-y-4">
            <Link
              to="/account"
              onClick={closeNav}
              className="block brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300 py-2"
            >
              ACCOUNT
            </Link>
            
            <Link
              to="/cart"
              onClick={closeNav}
              className="block brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300 py-2"
            >
              CART
            </Link>
          </div>

        </nav>
      </div>
    </div>,
    document.body
  );
};

export default NavigationOverlay;