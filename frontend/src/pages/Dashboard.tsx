import React from 'react';
import { usePortfolios } from '../hooks/usePortfolio';
import { useMarketSummary } from '../hooks/useMarketData';
import Card from '../components/common/Card';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartPieIcon 
} from '@heroicons/react/24/outline';
import { classNames } from '../utils/classNames';

const Dashboard: React.FC = () => {
  const { data: portfolios, isLoading: portfoliosLoading } = usePortfolios();
  const { data: marketSummary, isLoading: marketLoading } = useMarketSummary();

  const totalStats = portfolios?.reduce(
    (acc, portfolio) => ({
      totalValue: acc.totalValue + portfolio.total_value,
      totalInvested: acc.totalInvested + portfolio.total_invested,
      totalPnL: acc.totalPnL + portfolio.total_pnl,
      portfolioCount: acc.portfolioCount + 1,
    }),
    { totalValue: 0, totalInvested: 0, totalPnL: 0, portfolioCount: 0 }
  ) || { totalValue: 0, totalInvested: 0, totalPnL: 0, portfolioCount: 0 };

  const totalPnLPercentage = totalStats.totalInvested > 0 
    ? (totalStats.totalPnL / totalStats.totalInvested) * 100 
    : 0;

  if (portfoliosLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your investment portfolio</p>
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
                R$ {totalStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                R$ {totalStats.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        {/* Total P&L */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {totalStats.totalPnL >= 0 ? (
                <ArrowTrendingUpIcon className="h-8 w-8 text-success-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-8 w-8 text-danger-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total P&L</p>
              <p className={classNames(
                "text-2xl font-bold",
                totalStats.totalPnL >= 0 ? "text-success-600" : "text-danger-600"
              )}>
                R$ {totalStats.totalPnL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={classNames(
                "text-sm font-medium",
                totalStats.totalPnL >= 0 ? "text-success-600" : "text-danger-600"
              )}>
                {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Portfolio Count */}
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartPieIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Portfolios</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.portfolioCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Summary */}
      {marketSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(marketSummary).map(([market, data]) => (
            <Card key={market}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {market === 'BR' ? 'Bovespa (IBOV)' : 'S&P 500'}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={classNames(
                    "text-lg font-medium",
                    data.change >= 0 ? "text-success-600" : "text-danger-600"
                  )}>
                    {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
                  </p>
                  <p className={classNames(
                    "text-sm font-medium",
                    data.change_percentage >= 0 ? "text-success-600" : "text-danger-600"
                  )}>
                    {data.change_percentage >= 0 ? '+' : ''}{data.change_percentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Portfolios List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Portfolios</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View All
          </button>
        </div>

        {portfolios && portfolios.length > 0 ? (
          <div className="space-y-4">
            {portfolios.slice(0, 3).map((portfolio) => (
              <div key={portfolio.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{portfolio.name}</h3>
                  <p className="text-sm text-gray-500">{portfolio.positions_count} positions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    R$ {portfolio.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={classNames(
                    "text-sm font-medium",
                    portfolio.total_pnl >= 0 ? "text-success-600" : "text-danger-600"
                  )}>
                    {portfolio.total_pnl >= 0 ? '+' : ''}
                    {portfolio.total_pnl_percentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ChartPieIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolios</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new portfolio.</p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Create Portfolio
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;