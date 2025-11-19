import React from 'react';
import { useCart, useCartCount, useCartTotal } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();
  const itemCount = useCartCount();
  const cartTotal = useCartTotal();
  
  // Calculate order totals
  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (productId: string, newQuantity: number, variantId?: string) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId, variantId);
    } else {
      await updateCartItem(productId, { quantity: newQuantity, variantId });
    }
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    await removeFromCart(productId, variantId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (loading && !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Error loading cart: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some products to get started!</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button 
          variant="outline" 
          onClick={handleClearCart}
          disabled={loading}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={`${item.product._id}-${item.variant?._id || 'default'}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    
                    {item.variant && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.variant.variantType}: {item.variant.variantValue}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                        <p className="font-semibold">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(
                            item.product._id, 
                            item.quantity - 1,
                            item.variant?._id
                          )}
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(
                            item.product._id, 
                            item.quantity + 1,
                            item.variant?._id
                          )}
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(
                            item.product._id, 
                            item.variant?._id
                          )}
                          disabled={loading}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              {shipping === 0 && (
                <div className="text-green-600 text-sm">
                  🎉 You qualify for free shipping!
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={loading}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;