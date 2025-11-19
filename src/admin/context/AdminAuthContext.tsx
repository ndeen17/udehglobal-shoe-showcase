import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock admin credentials - In production, this would be handled by a proper backend
const MOCK_ADMINS = [
  {
    id: '1',
    email: 'admin@udehglobal.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'super_admin' as const
  },
  {
    id: '2',
    email: 'manager@udehglobal.com',
    password: 'manager123',
    name: 'Store Manager',
    role: 'admin' as const
  }
];

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Authenticate with backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return false;
      }
      
      const result = await response.json();
      console.log('Login response:', result);
      
      // Response structure: { success: true, message: string, data: { user, accessToken, refreshToken } }
      const userData = result.data;
      
      // Check if user has admin role
      if (userData.user.role !== 'admin') {
        console.error('User does not have admin privileges');
        return false;
      }
      
      // Store auth token for API calls (use accessToken from response)
      localStorage.setItem('authToken', userData.accessToken);
      
      const adminData: Admin = {
        id: userData.user.id,
        email: userData.user.email,
        name: `${userData.user.firstName || ''} ${userData.user.lastName || ''}`.trim() || userData.user.email,
        role: userData.user.role
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin_session', JSON.stringify(adminData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('authToken');
  };

  const isAuthenticated = !!admin;

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};