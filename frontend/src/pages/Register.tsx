import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useRegister } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registerMutation = useRegister();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name || undefined,
        password: formData.password,
      });
      
      // Show success message
      setIsSuccess(true);
      
      // Brief delay before redirect to show success message
      setTimeout(() => {
        // The redirect will happen automatically through the auth store state change
      }, 1500);
      
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || 'User with this email or username already exists';
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: 'An error occurred during registration. Please try again.' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <ChartBarIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <Card>
          <form className="space-y-6 pb-4" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                <p className="text-sm text-danger-700">{errors.general}</p>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Account created successfully! Logging you in...
                </p>
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />

            <Input
              label="Full Name (optional)"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Must be at least 6 characters"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 py-3 px-4 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                minHeight: '44px'
              }}
              isLoading={registerMutation.isPending || isSuccess}
              disabled={isSuccess}
            >
              {registerMutation.isPending 
                ? 'Creating account...' 
                : isSuccess 
                ? 'Account created!' 
                : 'Create account'
              }
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;