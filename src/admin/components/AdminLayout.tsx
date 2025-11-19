import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Toaster } from '../../components/ui/toaster';
import { Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black text-white hover:bg-gray-800"
          size="icon"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <AdminSidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default AdminLayout;