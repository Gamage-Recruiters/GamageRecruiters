import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, Trash2, Search, PlusCircle, Eye, 
  ChevronUp, ChevronDown, Filter, MoreHorizontal,
  Download, RefreshCw, Share2, Calendar, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



    
// Mock blog post data based on the structure provided
const mockBlogPosts = [
 
];

function BlogManagement() {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobStats, setJobStats] = useState([]);


  // Filter blog posts based on search term and status
  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  

  // Sort blog posts by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  // Get relative time string (e.g., "2 days ago")
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays/30)} months ago`;
    return `${Math.floor(diffInDays/365)} years ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and publish blog posts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                    onClick={() => navigate("/blog/add")}
                    >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Post
         </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Posts</h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{mockBlogPosts.length}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              15%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Published Posts</h3>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {mockBlogPosts.filter(p => p.status === 'published').length}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              10%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Engagement</h3>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {mockBlogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-500 flex items-center">
              <ChevronUp className="h-4 w-4" />
              23%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Blog Posts Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className={`flex items-center px-3 py-2 border ${isFilterOpen ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {filterStatus !== 'all' && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                  )}
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button 
                      onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'all' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      All Posts
                    </button>
                    <button 
                      onClick={() => { setFilterStatus('published'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'published' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Published Only
                    </button>
                    <button 
                      onClick={() => { setFilterStatus('draft'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${filterStatus === 'draft' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Drafts Only
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={toggleSortDirection} 
                className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                {sortDirection === 'asc' ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Oldest First
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Newest First
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    onClick={toggleSortDirection}
                    className="flex items-center focus:outline-none group"
                  >
                    Date
                    <span className="ml-1 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
              {sortedPosts.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={post.image}
                        className="h-14 w-20 rounded-lg object-cover"
                        alt={`${post.title} thumbnail`}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <span className="flex items-center">
                            <img 
                              src={post.author.image} 
                              alt={post.author.name}
                              className="h-5 w-5 rounded-full mr-1"
                            />
                            {post.author.name}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white mb-2">
                      {post.category}
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {post.date}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getRelativeTime(post.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-3">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => navigate(`/blog/edit/1`)}
                        >
                        <Edit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
              
              {/* Empty State */}
              {sortedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Search className="h-8 w-8 mx-auto mb-4" />
                      <p className="font-medium">No blog posts found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default BlogManagement;