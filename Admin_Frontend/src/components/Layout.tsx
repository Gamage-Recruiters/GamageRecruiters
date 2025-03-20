import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Sidebar with animated transition */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 h-full overflow-y-auto bg-white/40 dark:bg-gray-900/40">
<div className="h-full">
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="w-full h-full px-6 py-8 overflow-y-auto"
>
  <Outlet />
</motion.div>


          </div>
        </main>
        
        {/* Decorative elements */}
        <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default Layout;