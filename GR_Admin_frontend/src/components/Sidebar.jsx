import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Calendar,
  BookOpen,
  Handshake,
  Mail,
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/admins', icon: Users, label: 'Admins' },
    { path: '/jobss', icon: Briefcase, label: 'Jobs' },
    { path: '/candidate', icon: FileText, label: 'Applications' },
    { path: '/workshops', icon: Calendar, label: 'Workshops' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/partners', icon: Handshake, label: 'Partners' },
    { path: '/inquiries', icon: Mail, label: 'Inquiries' },
    { path: '/JobDashboard', icon: Mail, label: 'Jobapp' },
  ];

  // Group menu items by category
  const mainMenuItems = menuItems.slice(0, 4);
  const secondaryMenuItems = menuItems.slice(4);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black z-20"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-purple-600 text-white shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    
      {/* Sidebar */}
      <motion.aside
        initial={{ x: isOpen ? 0 : -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 h-full w-64 z-30
          bg-white dark:bg-gray-800 shadow-lg md:shadow-none
          md:relative md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GR</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">Gamage</h1>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main menu */}
          <div className="mb-6">
            <h2 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Main
            </h2>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-4 py-2 text-sm rounded-lg
                      ${isActive 
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      group relative
                    `}
                  >
                    <div className={`
                      p-1 mr-3 rounded-md 
                      ${isActive 
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }
                    `}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Secondary menu */}
          <div className="mb-6">
            <h2 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Resources
            </h2>
            <nav className="space-y-1">
              {secondaryMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-4 py-2 text-sm rounded-lg
                      ${isActive 
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      group relative
                    `}
                  >
                    <div className={`
                      p-1 mr-3 rounded-md 
                      ${isActive 
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }
                    `}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Settings */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
          >
            <div className="p-1 mr-3 rounded-md text-gray-500 dark:text-gray-400">
              <Settings className="h-4 w-4" />
            </div>
            <span className="font-medium">Settings</span>
          </Link>
          
          {/* Collapse button - visible only on larger screens */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex w-full mt-2 items-center justify-between px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="font-medium">Collapse</span>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </motion.aside>

      {/* Collapsed sidebar (for desktop) */}
      {!isOpen && (
        <div className="hidden md:flex flex-col h-full w-16 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-center h-16 border-b border-gray-100 dark:border-gray-700">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GR</span>
            </div>
          </div>
          
          <div className="flex-1 py-4 flex flex-col items-center space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    p-2 rounded-lg relative group
                    ${isActive 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-600 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                    {item.label}
                  </div>
                  
                  {isActive && (
                    <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="py-4 flex flex-col items-center border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-600 dark:hover:text-gray-300 relative group"
            >
              <ChevronRight className="h-5 w-5" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                Expand Sidebar
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;