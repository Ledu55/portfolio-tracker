import React from 'react';

const DashboardSimple: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your investment portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">R$ 10.000,00</p>
            </div>
          </div>
        </div>

        {/* Total Invested */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">R$ 8.500,00</p>
            </div>
          </div>
        </div>

        {/* Total P&L */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total P&L</p>
              <p className="text-2xl font-bold text-green-600">R$ 1.500,00</p>
              <p className="text-sm font-medium text-green-600">+17.65%</p>
            </div>
          </div>
        </div>

        {/* Portfolio Count */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📁</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Portfolios</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolios List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Portfolios</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Conservative Portfolio', positions: 5, value: 'R$ 4.000,00', pnl: '+12.5%' },
            { name: 'Growth Portfolio', positions: 8, value: 'R$ 3.500,00', pnl: '+25.3%' },
            { name: 'International Portfolio', positions: 3, value: 'R$ 2.500,00', pnl: '+8.7%' },
          ].map((portfolio, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{portfolio.name}</h3>
                <p className="text-sm text-gray-500">{portfolio.positions} positions</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{portfolio.value}</p>
                <p className="text-sm font-medium text-green-600">{portfolio.pnl}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;