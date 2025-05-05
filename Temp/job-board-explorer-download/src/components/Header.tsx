
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-blue">JobBoard Explorer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome Admin</span>
            <button className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
