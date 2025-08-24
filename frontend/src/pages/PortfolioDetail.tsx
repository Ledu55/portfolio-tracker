import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio, useTransactions } from '../hooks/usePortfolio';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  ArrowLeftIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartPieIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { classNames } from '../utils/classNames';

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const portfolioId = id ? parseInt(id, 10) : undefined;
  
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = usePortfolio(portfolioId);
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(portfolioId);

  const handleGoBack = () => {
    navigate('/app/portfolios');
  };

  const handleAddTransaction = () => {
    navigate('/app/transactions/new');
  };

  if (portfolioLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (portfolioError || !portfolio) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mr-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Not Found</h1>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600">Portfolio not found or you don't have access to it.</p>
            <Button onClick={handleGoBack} className="mt-4">
              Back to Portfolios
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mr-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{portfolio.name}</h1>
            {portfolio.description && (
              <p className="text-sm text-gray-600">{portfolio.description}</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleAddTransaction}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Value */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {portfolio.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Invested */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartPieIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {portfolio.total_invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        {/* Total P&L */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {portfolio.total_pnl >= 0 ? (
                <ArrowTrendingUpIcon className="h-8 w-8 text-success-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-8 w-8 text-danger-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total P&L</p>
              <p className={classNames(
                "text-2xl font-bold",
                portfolio.total_pnl >= 0 ? "text-success-600" : "text-danger-600"
              )}>
                {portfolio.total_pnl >= 0 ? '+' : ''}
                R$ {portfolio.total_pnl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={classNames(
                "text-sm font-medium",
                portfolio.total_pnl >= 0 ? "text-success-600" : "text-danger-600"
              )}>
                {portfolio.total_pnl >= 0 ? '+' : ''}{Number(portfolio.total_pnl_percentage || 0).toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Positions Count */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.positions_count}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTransaction}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {transactionsLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.symbol}
                        </div>
                        {transaction.company_name && (
                          <div className="text-sm text-gray-500">
                            {transaction.company_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        transaction.transaction_type === 'BUY' 
                          ? "bg-success-100 text-success-800"
                          : "bg-danger-100 text-danger-800"
                      )}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {transaction.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {transaction.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first transaction to this portfolio.
            </p>
            <div className="mt-6">
              <Button onClick={handleAddTransaction}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PortfolioDetail;