import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  BanknotesIcon, 
  PlusIcon, 
  ChartPieIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { classNames } from '../../utils/classNames';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: ChartBarIcon },
  { name: 'Portfolios', href: '/app/portfolios', icon: ChartPieIcon },
  { name: 'Transactions', href: '/app/transactions', icon: BanknotesIcon },
  { name: 'Add Transaction', href: '/app/transactions/new', icon: PlusIcon },
  { name: 'Settings', href: '/app/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            Portfolio Tracker
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              classNames(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={classNames(
                    'mr-3 h-5 w-5',
                    isActive
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;