import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Add Transaction', path: '/add-transaction' },
    { name: 'Transactions', path: '/transactions' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
            Finance Dashboard
          </span>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    location.pathname === item.path
                      ? 'text-white bg-primary-700 dark:bg-primary-500 dark:text-gray-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;