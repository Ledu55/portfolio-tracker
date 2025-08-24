import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Real Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolios from './pages/Portfolios';
import PortfolioDetail from './pages/PortfolioDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';



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
            <Route path="/" element={<Navigate to="/login" replace />} />
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
              <Route path="portfolios" element={<Portfolios />} />
              <Route path="portfolios/:id" element={<PortfolioDetail />} />
              <Route path="transactions" element={<div className="p-8 text-center">Transactions Page Coming Soon...</div>} />
              <Route path="transactions/new" element={<div className="p-8 text-center">Add Transaction Page Coming Soon...</div>} />
              <Route path="settings" element={<div className="p-8 text-center">Settings Page Coming Soon...</div>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
