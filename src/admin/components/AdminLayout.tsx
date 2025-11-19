import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Toaster } from '../../components/ui/toaster';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Outlet />
        </div>
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default AdminLayout;