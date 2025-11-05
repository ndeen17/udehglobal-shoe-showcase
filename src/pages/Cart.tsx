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
      <div className="min-h-screen bg-background pt-20 px-brutalist-md">
        <div className="pt-brutalist-md">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1} />
            <span>BACK</span>
          </Link>
        </div>
        
        <div className="text-center pt-brutalist-2xl">
          <h1 className="font-brutalist text-brutalist-lg font-light tracking-widest text-foreground mb-brutalist-md">
            CART IS EMPTY
          </h1>
          <Link 
            to="/"
            className="font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
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
      <div className="px-brutalist-md pt-brutalist-md">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 font-brutalist text-brutalist-sm font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Cart Content */}
      <div className="px-brutalist-md py-brutalist-xl">
        <div className="max-w-2xl mx-auto">
          
          {/* Cart Header */}
          <div className="text-center mb-brutalist-xl">
            <h1 className="font-brutalist text-brutalist-lg font-light tracking-widest text-foreground">
              CART ({cartCount})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="space-y-brutalist-md">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-brutalist-md border-t border-muted pt-brutalist-md">
                
                {/* Item Image */}
                <div className="w-20 h-20 bg-secondary flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 space-y-brutalist-xs">
                  <h3 className="font-brutalist text-brutalist-sm font-light tracking-wider text-foreground">
                    {item.title.toUpperCase()}
                  </h3>
                  <p className="font-brutalist text-brutalist-xs font-light tracking-wide text-muted-foreground">
                    QTY: {item.quantity}
                  </p>
                  <p className="font-brutalist text-brutalist-sm font-light tracking-wide text-foreground">
                    {item.price}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-transparent transition-none"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-brutalist-xl pt-brutalist-md border-t border-muted">
            <div className="flex justify-between items-center mb-brutalist-md">
              <span className="font-brutalist text-brutalist-sm font-light tracking-wider text-foreground">
                TOTAL
              </span>
              <span className="font-brutalist text-brutalist-lg font-light tracking-wider text-foreground">
                ₦{total.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button 
                onClick={clearCart}
                className="font-brutalist text-brutalist-xs font-light tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                CLEAR CART
              </button>
              
              <button 
                className="font-brutalist text-brutalist-sm font-light tracking-widest text-foreground hover:text-muted-foreground transition-colors duration-300 bg-transparent border-0 p-0"
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