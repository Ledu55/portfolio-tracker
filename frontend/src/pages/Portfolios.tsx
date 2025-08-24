import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolios, useDeletePortfolio } from '../hooks/usePortfolio';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChartPieIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { classNames } from '../utils/classNames';
import CreatePortfolioModal from '../components/Portfolio/CreatePortfolioModal';
import EditPortfolioModal from '../components/Portfolio/EditPortfolioModal';
import DeleteConfirmationModal from '../components/Portfolio/DeleteConfirmationModal';

const Portfolios: React.FC = () => {
  const navigate = useNavigate();
  const { data: portfolios, isLoading, error } = usePortfolios();
  const deletePortfolio = useDeletePortfolio();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<any>(null);

  const handleDelete = async () => {
    if (deletingPortfolio) {
      try {
        await deletePortfolio.mutateAsync(deletingPortfolio.id);
        setDeletingPortfolio(null);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolios</h1>
          <p className="text-sm text-gray-600">Manage your investment portfolios</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading portfolios. Please try again.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolios</h1>
          <p className="text-sm text-gray-600">Manage your investment portfolios</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Portfolio
        </Button>
      </div>

      {portfolios && portfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="relative">
              {/* Default badge */}
              {portfolio.is_default && (
                <div className="absolute top-4 right-4">
                  <StarIconSolid className="h-5 w-5 text-yellow-500" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {portfolio.name}
                    </h3>
                    {portfolio.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {portfolio.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Value</span>
                    <span className="text-lg font-bold text-gray-900">
                      R$ {portfolio.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Invested</span>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {portfolio.total_invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">P&L</span>
                    <div className="text-right">
                      <span className={classNames(
                        "text-sm font-bold",
                        portfolio.total_pnl >= 0 ? "text-success-600" : "text-danger-600"
                      )}>
                        {portfolio.total_pnl >= 0 ? '+' : ''}
                        R$ {portfolio.total_pnl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className={classNames(
                        "text-xs font-medium",
                        portfolio.total_pnl >= 0 ? "text-success-600" : "text-danger-600"
                      )}>
                        {portfolio.total_pnl >= 0 ? '+' : ''}{Number(portfolio.total_pnl_percentage || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Positions</span>
                    <span className="text-sm font-medium text-gray-900">
                      {portfolio.positions_count}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/portfolios/${portfolio.id}`)}
                    className="flex-1 inline-flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPortfolio(portfolio)}
                    className="flex-1 inline-flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingPortfolio(portfolio)}
                    disabled={portfolios.length <= 1}
                    className="flex-1 inline-flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <ChartPieIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Get started by creating your first investment portfolio.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Portfolio
            </Button>
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {editingPortfolio && (
        <EditPortfolioModal
          portfolio={editingPortfolio}
          isOpen={!!editingPortfolio}
          onClose={() => setEditingPortfolio(null)}
        />
      )}
      
      {deletingPortfolio && (
        <DeleteConfirmationModal
          portfolio={deletingPortfolio}
          isOpen={!!deletingPortfolio}
          onClose={() => setDeletingPortfolio(null)}
          onConfirm={handleDelete}
          isDeleting={deletePortfolio.isPending}
        />
      )}
    </div>
  );
};

export default Portfolios;