import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Calendar,
  BookOpen,
  Mail,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  UserCircle
} from 'lucide-react';
import baseURL from '../config/baseUrlConfig';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    role: 'Administrator',
    image: null
  });

  // Simulating fetching admin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get adminId from localStorage
        const currentAdminId = localStorage.getItem('adminId');

        if (!currentAdminId) {
          console.error('No admin ID found in localStorage');
          return;
        }

        const response = await fetch(`${baseURL}/admin/${currentAdminId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }

        const result = await response.json();
        const adminObject = result.data[0];

        setAdminData({
          name: adminObject?.name || 'Admin User',
          role: adminObject?.role || 'Administrator',
          image: adminObject?.image ? `/uploads/admin/${adminObject.image}` : null
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await axios.post(`${baseURL}/admin/logout`, {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        // Clear any local storage/session storage items
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId'); // Make sure to remove adminId too if stored
        sessionStorage.removeItem('adminData');

        // Redirect to login page
        navigate('/');
      } else {
        console.error('Logout failed', response.data);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/admins', icon: Users, label: 'Admins' },
    { path: '/jobss', icon: Briefcase, label: 'Jobs' },
    { path: '/candidate', icon: FileText, label: 'Applications View' },
    { path: '/workshops', icon: Calendar, label: 'Workshops' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/inquiries', icon: Mail, label: 'Inquiries' },
  ];

  // Group menu items by category
  const mainMenuItems = menuItems.slice(0, 4);
  const secondaryMenuItems = menuItems.slice(4);

  // Define sidebar variants for Framer Motion to control width and visibility
  const sidebarVariants = {
    open: { width: '18rem', x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }, // w-72 = 18rem
    closed: { width: '4rem', x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }, // w-16 = 4rem
  };

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

      {/* Mobile toggle button (visible when sidebar is closed) - You might want to remove this if Navbar handles it */}
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
        initial={false} // Don't animate on initial render
        animate={isOpen ? "open" : "closed"} // Animate based on isOpen prop for desktop
        variants={sidebarVariants}
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-gray-800 shadow-lg md:shadow-none
          ${isOpen ? 'w-72' : 'w-16'}  // Apply default widths for mobile/initial render
          md:relative // On medium screens and up, make it relative in the flex layout
          md:w-auto // Reset width control to Framer Motion variants on medium screens+
          
          /* Hide scrollbar for webkit browsers */
          [&::-webkit-scrollbar]:hidden
          /* Hide scrollbar for IE, Edge and Firefox */
          [-ms-overflow-style:none] [scrollbar-width:none]
        `}
      >
        {/* --- Top Section: Logo and Close Button --- */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-700">
          {isOpen ? ( // Show full logo and text when open
            <div className="flex items-center space-x-2">
              {darkMode ? (
                <img src="https://i.ibb.co/twq26b0M/W-logo-Untitled-1.png" alt="Gamage White Logo" className="h-8" />
              ) : (
                <img src="https://i.ibb.co/LDvQZXBq/B-logo-Untitled-1.png" alt="Gamage Black Logo" className="h-8" />
              )}
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">Gamage Recruiters</h1>
            </div>
          ) : ( // Show only the icon when collapsed
            <div className="flex items-center justify-center w-full">
              {darkMode ? (
                <img src="https://i.ibb.co/twq26b0M/W-logo-Untitled-1.png" alt="Gamage White Logo Icon" className="h-8" />
              ) : (
                <img src="https://i.ibb.co/LDvQZXBq/B-logo-Untitled-1.png" alt="Gamage Black Logo Icon" className="h-8" />
              )}
            </div>
          )}

          {/* Mobile close button (only visible on mobile when sidebar is fixed open) */}
          <button
            onClick={() => setIsOpen(false)}
            className={`md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${!isOpen && 'hidden'}`}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Admin Profile Summary */}
        <div className={`py-3 border-b border-gray-100 dark:border-gray-700 ${isOpen ? 'px-4' : 'flex justify-center px-2'}`}>
          <Link
            to="/admins/profile"
            className={`flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg ${!isOpen && 'flex-col space-x-0'}`}
          >
            {adminData.image ? (
              <img
                src={adminData.image}
                alt={adminData.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 dark:border-purple-900"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <UserCircle className="h-6 w-6" />
              </div>
            )}
            <div className={`flex-1 min-w-0 ${!isOpen ? 'hidden' : ''}`}>
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {adminData.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {adminData.role}
              </p>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ${!isOpen ? 'hidden' : ''}`}>
              Online
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {adminData.name} ({adminData.role})
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Web Admin Panel header */}
          <div className={`mb-4 ${isOpen ? 'px-4' : 'hidden'}`}>
            <h1 className="text-sm font-bold text-purple-600 dark:text-purple-400">
              Web Admin Panel
            </h1>
          </div>

          {/* Main menu */}
          <div className="mb-6">
            <h2 className={`px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ${isOpen ? '' : 'hidden'}`}>
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
                      flex items-center py-2 text-sm rounded-lg group relative
                      ${isActive
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      ${isOpen ? 'px-4' : 'justify-center px-2'}
                    `}
                  >
                    <div className={`
                      p-1 rounded-md
                      ${isActive
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }
                      ${isOpen ? 'mr-3' : 'mr-0'}
                    `}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>
                      {item.label}
                    </span>
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
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
            <h2 className={`px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ${isOpen ? '' : 'hidden'}`}>
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
                      flex items-center py-2 text-sm rounded-lg group relative
                      ${isActive
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      ${isOpen ? 'px-4' : 'justify-center px-2'}
                    `}
                  >
                    <div className={`
                      p-1 rounded-md
                      ${isActive
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }
                      ${isOpen ? 'mr-3' : 'mr-0'}
                    `}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>
                      {item.label}
                    </span>
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 dark:bg-purple-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className={`p-3 border-t border-gray-100 dark:border-gray-700 ${isOpen ? '' : 'flex flex-col items-center'}`}>

          {/* Settings Button */}
          {/* Note: This was missing in the expanded mode of your previous code. Adding it for consistency. */}
          <Link
            to="/settings"
            className={`w-full flex items-center py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group mt-1
              ${isOpen ? 'px-4' : 'justify-center w-auto px-2'}
            `}
          >
            <div className={`p-1 rounded-md text-gray-500 dark:text-gray-400 ${isOpen ? 'mr-3' : 'mr-0'}`}>
              <Settings className="h-4 w-4" />
            </div>
            <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>Settings</span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                Settings
              </div>
            )}
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 group mt-1
              ${isOpen ? 'px-4' : 'justify-center w-auto px-2'}
            `}
          >
            <div className={`p-1 rounded-md text-gray-500 dark:text-gray-400 ${isOpen ? 'mr-3' : 'mr-0'}`}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </div>
            <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center py-2 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group mt-1
              ${isOpen ? 'px-4' : 'justify-center w-auto px-2'}
            `}
          >
            <div className={`p-1 rounded-md text-red-500 dark:text-red-400 ${isOpen ? 'mr-3' : 'mr-0'}`}>
              <LogOut className="h-4 w-4" />
            </div>
            <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>Logout</span>
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>

          {/* Collapse/Expand button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex w-full mt-2 items-center py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50
              ${isOpen ? 'px-4 justify-between' : 'justify-center px-2'}
            `}
          >
            <span className={`font-medium ${!isOpen ? 'hidden' : ''}`}>
              {isOpen ? 'Collapse' : 'Expand'}
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              </div>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;