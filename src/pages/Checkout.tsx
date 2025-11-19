import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Lock, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'success'>('shipping');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₦', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 2000;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = () => {
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      setStep('success');
    }, 1500);
  };

  if (cartCount === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="max-w-2xl mx-auto text-center pt-32">
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
            NO ITEMS TO CHECKOUT
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

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="max-w-2xl mx-auto text-center pt-32">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-8" />
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-4">
            ORDER PLACED SUCCESSFULLY
          </h1>
          <p className="brutalist-body text-sm tracking-wide text-gray-500 mb-8">
            Thank you for your purchase! You will receive an email confirmation shortly.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Order #: {Date.now().toString().slice(-8)}</p>
            <Link 
              to="/"
              className="inline-block brutalist-body text-sm tracking-wider text-foreground hover:text-gray-500 transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back Navigation */}
      <div className="px-4 md:px-8 pt-4 md:pt-8">
        <Link 
          to="/cart"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300 py-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK TO CART</span>
        </Link>
      </div>

      <div className="px-4 md:px-8 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
            
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Progress Steps */}
              <div className="flex items-center space-x-4 md:space-x-8 overflow-x-auto pb-2">
                <div className={`flex items-center space-x-1 md:space-x-2 flex-shrink-0 ${step === 'shipping' ? 'text-foreground' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${step === 'shipping' ? 'border-foreground' : step === 'payment' || step === 'review' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'}`}>
                    {step === 'payment' || step === 'review' ? '✓' : '1'}
                  </div>
                  <span className="text-xs md:text-sm tracking-wide whitespace-nowrap">SHIPPING</span>
                </div>
                <div className={`flex items-center space-x-1 md:space-x-2 flex-shrink-0 ${step === 'payment' ? 'text-foreground' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${step === 'payment' ? 'border-foreground' : step === 'review' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'}`}>
                    {step === 'review' ? '✓' : '2'}
                  </div>
                  <span className="text-xs md:text-sm tracking-wide whitespace-nowrap">PAYMENT</span>
                </div>
                <div className={`flex items-center space-x-1 md:space-x-2 flex-shrink-0 ${step === 'review' ? 'text-foreground' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${step === 'review' ? 'border-foreground' : 'border-gray-400'}`}>
                    3
                  </div>
                  <span className="text-xs md:text-sm tracking-wide whitespace-nowrap">REVIEW</span>
                </div>
              </div>

              {/* Step Content */}
              {step === 'shipping' && (
                <div>
                  <h2 className="brutalist-heading text-base md:text-lg tracking-widest text-foreground mb-6 md:mb-8">
                    SHIPPING INFORMATION
                  </h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-sm tracking-wide text-gray-600">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm tracking-wide text-gray-600">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm tracking-wide text-gray-600">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm tracking-wide text-gray-600">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm tracking-wide text-gray-600">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="city" className="text-sm tracking-wide text-gray-600">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm tracking-wide text-gray-600">
                          State *
                        </Label>
                        <Select
                          value={shippingData.state}
                          onValueChange={(value) => setShippingData(prev => ({ ...prev, state: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lagos">Lagos</SelectItem>
                            <SelectItem value="abuja">Abuja</SelectItem>
                            <SelectItem value="kano">Kano</SelectItem>
                            <SelectItem value="rivers">Rivers</SelectItem>
                            <SelectItem value="ogun">Ogun</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-sm tracking-wide text-gray-600">
                          ZIP Code
                        </Label>
                        <Input
                          id="zipCode"
                          value={shippingData.zipCode}
                          onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full md:w-auto bg-black text-white hover:bg-gray-800 h-12 md:h-10"
                    >
                      CONTINUE TO PAYMENT
                    </Button>
                  </form>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
                    PAYMENT INFORMATION
                  </h2>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <Label className="text-sm tracking-wide text-gray-600 mb-4 block">
                        Payment Method
                      </Label>
                      <RadioGroup
                        value={paymentData.method}
                        onValueChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                            <CreditCard className="w-4 h-4" />
                            <span>Credit/Debit Card</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="paystack" id="paystack" />
                          <Label htmlFor="paystack" className="cursor-pointer">Paystack</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentData.method === 'card' && (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="nameOnCard" className="text-sm tracking-wide text-gray-600">
                            Name on Card *
                          </Label>
                          <Input
                            id="nameOnCard"
                            value={paymentData.nameOnCard}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                            required
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber" className="text-sm tracking-wide text-gray-600">
                            Card Number *
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                            required
                            className="mt-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="expiryDate" className="text-sm tracking-wide text-gray-600">
                              Expiry Date *
                            </Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentData.expiryDate}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                              required
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm tracking-wide text-gray-600">
                              CVV *
                            </Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                              required
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep('shipping')}
                      >
                        BACK
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        REVIEW ORDER
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'review' && (
                <div>
                  <h2 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
                    REVIEW ORDER
                  </h2>

                  <div className="space-y-8">
                    {/* Shipping Info */}
                    <div>
                      <h3 className="text-sm tracking-wide text-gray-600 mb-4">SHIPPING TO:</h3>
                      <div className="bg-gray-50 p-4 text-sm">
                        <p>{shippingData.firstName} {shippingData.lastName}</p>
                        <p>{shippingData.address}</p>
                        <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                        <p>{shippingData.phone}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm tracking-wide text-gray-600 mb-4">ORDER ITEMS:</h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => setStep('payment')}
                      >
                        BACK
                      </Button>
                      <Button 
                        onClick={handlePlaceOrder}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        PLACE ORDER
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6 space-y-6 sticky top-24">
                <h3 className="brutalist-heading text-sm tracking-widest text-foreground">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({cartCount} items):</span>
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
                  <Separator />
                  <div className="flex justify-between text-base font-medium">
                    <span className="brutalist-body tracking-wider">TOTAL:</span>
                    <span className="brutalist-subheading">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3 h-3" />
                    <span>Free shipping on orders over ₦50,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>Secure Payment Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;