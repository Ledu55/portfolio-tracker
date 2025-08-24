import React from 'react';
import Button from '../common/Button';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationModalProps {
  portfolio: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  portfolio, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}) => {
  if (!isOpen || !portfolio) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Delete Portfolio
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              disabled={isDeleting}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the portfolio "{portfolio.name}"? This action cannot be undone.
            </p>
            
            {portfolio.positions_count > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This portfolio contains {portfolio.positions_count} position{portfolio.positions_count !== 1 ? 's' : ''}. 
                        Deleting it will also remove all associated transactions and data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio Summary:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span>R$ {portfolio.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Positions:</span>
                  <span>{portfolio.positions_count}</span>
                </div>
                {portfolio.is_default && (
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-yellow-600">Default Portfolio</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500 border-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Portfolio'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;