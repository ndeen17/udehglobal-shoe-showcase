import { Link } from 'react-router-dom';
import { ArrowLeft, X, Plus, Minus, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Cart = () => {
  const { cartItems, cartCount, removeFromCart, clearCart, updateCartQuantity } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₦', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 2000; // Free shipping over ₦50,000
  const tax = subtotal * 0.075; // 7.5% VAT
  const discountAmount = isPromoApplied ? subtotal * discount : 0;
  const total = subtotal + shipping + tax - discountAmount;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartQuantity(itemId, newQuantity);
  };

  const handlePromoCode = () => {
    const validCodes = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'STUDENT15': 0.15,
      'FIRST5': 0.05
    };

    if (validCodes[promoCode.toUpperCase() as keyof typeof validCodes]) {
      setDiscount(validCodes[promoCode.toUpperCase() as keyof typeof validCodes]);
      setIsPromoApplied(true);
    }
  };

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
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-8" strokeWidth={1} />
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-4">
            YOUR CART IS EMPTY
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-8">
            Looks like you haven't added any items yet.
          </p>
          <Link 
            to="/"
            className="brutalist-body text-sm tracking-wider text-foreground hover:text-gray-500 transition-colors duration-300"
          >
            START SHOPPING
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              {/* Cart Header */}
              <div className="mb-16">
                <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-4">
                  SHOPPING CART ({cartCount})
                </h1>
                <div className="flex gap-8 text-xs tracking-wide text-gray-500">
                  <span className="flex items-center gap-2">
                    <Truck className="w-3 h-3" />
                    Free shipping on orders over ₦50,000
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    30-day return policy
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center border-t border-gray-200 pt-6">
                    
                    {/* Item Image */}
                    <div className="col-span-3">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95"
                        />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="col-span-6 space-y-2">
                      <h3 className="brutalist-body text-sm tracking-wider text-foreground">
                        {item.title.toUpperCase()}
                      </h3>
                      <p className="brutalist-body text-xs tracking-wide text-gray-500">
                        Category: {item.category}
                      </p>
                      <p className="brutalist-body text-sm tracking-wide text-foreground">
                        {item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 py-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-foreground" strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <Link 
                  to="/"
                  className="brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
                >
                  ← CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6 space-y-6">
                <h2 className="brutalist-heading text-sm tracking-widest text-foreground">
                  ORDER SUMMARY
                </h2>

                {/* Promo Code */}
                <div className="space-y-3">
                  <label className="brutalist-body text-xs tracking-wide text-gray-500">
                    PROMO CODE
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 text-sm"
                    />
                    <Button 
                      onClick={handlePromoCode}
                      variant="outline"
                      size="sm"
                      disabled={isPromoApplied}
                    >
                      {isPromoApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                  {isPromoApplied && (
                    <p className="text-xs text-green-600">
                      ✓ Discount applied: {(discount * 100).toFixed(0)}% off
                    </p>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (7.5%):</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                  {isPromoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                    <span className="brutalist-body tracking-wider">TOTAL:</span>
                    <span className="brutalist-subheading">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Actions */}
                <div className="space-y-3">
                  <Link to="/checkout">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <CreditCard className="w-4 h-4 mr-2" />
                      PROCEED TO CHECKOUT
                    </Button>
                  </Link>
                  <button 
                    onClick={clearCart}
                    className="w-full brutalist-body text-xs tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
                  >
                    CLEAR CART
                  </button>
                </div>

                {/* Security Notice */}
                <div className="text-xs text-gray-500 text-center">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Secure checkout with SSL encryption
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;