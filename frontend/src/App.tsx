import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Real Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';

// Simple test pages
const HomePage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Portfolio Tracker
      </h1>
      <p className="text-gray-600 mb-8">
        Homepage funcionando ✅
      </p>
      <div className="space-x-4">
        <a href="/app" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Entrar na App
        </a>
        <a href="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Login
        </a>
      </div>
    </div>
  </div>
);


// Create a simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  console.log('App component rendered with full layout');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected app routes with layout */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="portfolios" element={<div className="p-8 text-center">Portfolios Page Coming Soon...</div>} />
              <Route path="transactions" element={<div className="p-8 text-center">Transactions Page Coming Soon...</div>} />
              <Route path="transactions/new" element={<div className="p-8 text-center">Add Transaction Page Coming Soon...</div>} />
              <Route path="settings" element={<div className="p-8 text-center">Settings Page Coming Soon...</div>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
