import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [initializeAuth]);

  // Show loading screen while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;