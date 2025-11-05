import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Cart = () => {
  const { cartItems, cartCount, removeFromCart, clearCart } = useApp();

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₦', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="pt-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1} />
            <span>BACK</span>
          </Link>
        </div>
        
        <div className="text-center pt-32">
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
            CART IS EMPTY
          </h1>
          <Link 
            to="/"
            className="brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
          >
            CONTINUE SHOPPING
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

      {/* Cart Content */}
      <div className="px-8 py-16">
        <div className="max-w-2xl mx-auto">
          
          {/* Cart Header */}
          <div className="text-center mb-16">
            <h1 className="brutalist-heading text-lg tracking-widest text-foreground">
              CART ({cartCount})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-8 border-t border-gray-200 pt-8">
                
                {/* Item Image */}
                <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 space-y-2">
                  <h3 className="brutalist-body text-sm tracking-wider text-foreground">
                    {item.title.toUpperCase()}
                  </h3>
                  <p className="brutalist-body text-xs tracking-wide text-gray-500">
                    QTY: {item.quantity}
                  </p>
                  <p className="brutalist-body text-sm tracking-wide text-foreground">
                    {item.price}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-transparent transition-none"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4 text-gray-500 hover:text-foreground" strokeWidth={1} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-8">
              <span className="brutalist-body text-sm tracking-wider text-foreground">
                TOTAL
              </span>
              <span className="brutalist-subheading text-lg tracking-wider text-foreground">
                ₦{total.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button 
                onClick={clearCart}
                className="brutalist-body text-xs tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
              >
                CLEAR CART
              </button>
              
              <button 
                className="brutalist-body text-sm tracking-widest text-foreground hover:text-gray-500 transition-colors duration-300 bg-transparent border-0 p-0"
              >
                CHECKOUT
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;