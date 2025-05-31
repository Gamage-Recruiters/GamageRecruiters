import React, { useState } from 'react';
import { Menu, Bell, User, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function Navbar({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
  console.log("Navigating to admin profile");
  navigate('/admins/profile');
};

  
  return (
    <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search bar */}
            <div className={`relative transition-all duration-300 ${searchFocused ? 'w-64' : 'w-48'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white relative focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            </button>
            
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center pl-2">
              <button  onClick={handleClick} className="flex items-center space-x-3 py-1 px-3 rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white group">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-medium overflow-hidden">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                </div>
                <span className="hidden md:block font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;