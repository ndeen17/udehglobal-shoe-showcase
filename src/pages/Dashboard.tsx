import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Package, Heart, Settings, Edit3, Camera, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistItems, addToCart, removeFromWishlist } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+234 123 456 7890',
    address: '123 Main Street, Lagos, Nigeria',
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-20 px-8">
        <div className="max-w-2xl mx-auto text-center pt-32">
          <h1 className="brutalist-heading text-lg tracking-widest text-foreground mb-8">
            PLEASE SIGN IN
          </h1>
          <Link 
            to="/login"
            className="brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
          >
            GO TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({
      name: profileData.name,
      email: profileData.email,
    });
    setIsEditing(false);
  };

  // Mock order data
  const orders = [
    {
      id: '1',
      date: '2025-11-10',
      status: 'Delivered',
      total: '₦45,000',
      items: 3,
    },
    {
      id: '2',
      date: '2025-11-05',
      status: 'Shipping',
      total: '₦28,500',
      items: 2,
    },
    {
      id: '3',
      date: '2025-10-28',
      status: 'Processing',
      total: '₦15,000',
      items: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      {/* Back Navigation */}
      <div className="px-4 md:px-8 pt-4 md:pt-8">
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 brutalist-body text-sm tracking-wider text-gray-500 hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1} />
          <span>BACK</span>
        </Link>
      </div>

      <div className="px-4 md:px-8 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h1 className="brutalist-heading text-base md:text-lg tracking-widest text-foreground mb-2">
                MY ACCOUNT
              </h1>
              <p className="brutalist-body text-sm tracking-wide text-gray-500">
                Manage your profile and orders
              </p>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="brutalist-body text-xs tracking-wider"
            >
              SIGN OUT
            </Button>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>PROFILE</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>ORDERS</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>WISHLIST</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>SETTINGS</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm tracking-wider">PROFILE PICTURE</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Click to change photo</p>
                  </CardContent>
                </Card>

                {/* Profile Information */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm tracking-wider">PERSONAL INFORMATION</CardTitle>
                      <Button 
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditing ? 'SAVE' : 'EDIT'}</span>
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm tracking-wide text-gray-600">
                            Full Name
                          </Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-2"
                            />
                          ) : (
                            <p className="mt-2 text-sm">{profileData.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-sm tracking-wide text-gray-600">
                            Email Address
                          </Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              className="mt-2"
                            />
                          ) : (
                            <p className="mt-2 text-sm">{profileData.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm tracking-wide text-gray-600 flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>Phone Number</span>
                          </Label>
                          {isEditing ? (
                            <Input
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              className="mt-2"
                            />
                          ) : (
                            <p className="mt-2 text-sm">{profileData.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm tracking-wide text-gray-600 flex items-center space-x-2">
                            <MapPin className="w-3 h-3" />
                            <span>Address</span>
                          </Label>
                          {isEditing ? (
                            <Input
                              value={profileData.address}
                              onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                              className="mt-2"
                            />
                          ) : (
                            <p className="mt-2 text-sm">{profileData.address}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider">ORDER HISTORY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">Order #{order.id}</span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipping' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{order.items} items</span>
                          <span className="text-sm font-medium">{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider">MY WISHLIST</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 p-4 group hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover filter grayscale-[20%] contrast-90 brightness-95 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.price}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addToCart({
                              id: item.id,
                              title: item.title,
                              price: item.price,
                              image: item.image,
                              category: item.category
                            })}
                          >
                            ADD TO CART
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm tracking-wider">ACCOUNT SETTINGS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium">Email Notifications</h4>
                        <p className="text-xs text-gray-500">Receive updates about your orders</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium">SMS Notifications</h4>
                        <p className="text-xs text-gray-500">Get SMS updates for shipping</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium">Marketing Emails</h4>
                        <p className="text-xs text-gray-500">Receive promotional offers</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm tracking-wider text-red-600">DANGER ZONE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-sm font-medium text-red-600">Delete Account</h4>
                        <p className="text-xs text-gray-500">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        DELETE ACCOUNT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;