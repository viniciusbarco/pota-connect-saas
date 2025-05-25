
import React from 'react';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pota-pink-light via-white to-pota-blue-light">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pota-pink to-pota-blue rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
