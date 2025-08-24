import React, { useState, useEffect } from 'react';
import { useUpdatePortfolio } from '../../hooks/usePortfolio';
import Button from '../common/Button';
import Input from '../common/Input';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditPortfolioModalProps {
  portfolio: any;
  isOpen: boolean;
  onClose: () => void;
}

const EditPortfolioModal: React.FC<EditPortfolioModalProps> = ({ portfolio, isOpen, onClose }) => {
  const updatePortfolio = useUpdatePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_default: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form data when portfolio changes
  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name || '',
        description: portfolio.description || '',
        is_default: portfolio.is_default || false,
      });
    }
  }, [portfolio]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Portfolio name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Portfolio name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !portfolio) {
      return;
    }

    try {
      await updatePortfolio.mutateAsync({
        id: portfolio.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          is_default: formData.is_default,
        }
      });
      
      // Reset errors and close modal
      setErrors({});
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Edit Portfolio
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Portfolio Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., My Investment Portfolio"
                error={errors.name}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of your portfolio..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                id="edit_is_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => handleChange('is_default', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="edit_is_default" className="ml-2 block text-sm text-gray-900">
                Set as default portfolio
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={updatePortfolio.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updatePortfolio.isPending}
              >
                {updatePortfolio.isPending ? 'Updating...' : 'Update Portfolio'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolioModal;