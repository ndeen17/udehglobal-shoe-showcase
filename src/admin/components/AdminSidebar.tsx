import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  Store,
  Tag
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Button } from '../../components/ui/button';

const AdminSidebar: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Overview & Stats'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      description: 'Manage Inventory'
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Tag,
      description: 'Category Management'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Order Management'
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
      description: 'User Management'
    }
  ];

  return (
    <div className="w-64 bg-black border-r border-white/10 min-h-screen flex flex-col">
      {/* Admin Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <Store className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">UdehGlobal</h2>
            <p className="text-gray-400 text-sm">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">
              {admin?.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{admin?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{admin?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-black' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isActive ? 'text-black' : ''}`}>
                      {item.name}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-black/60' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;