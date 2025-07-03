import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Trash2, Search, UserPlus, Eye,
  ChevronUp, ChevronDown, Filter, Download, RefreshCw, Calendar
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../config/baseUrlConfig';

function ClientUsers() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/all`, {
          withCredentials: true
        });
        const allUsers = response.data.data;

        // Optionally add a fake status to each user
        const enhancedUsers = allUsers.map(user => ({
          ...user,
          status: Math.random() > 0.5 ? 'active' : 'inactive', // Mock status
        }));

        setClients(enhancedUsers);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
  
    try {
      await axios.delete(`${baseURL}/user/delete-profile/${userId}`, {
        withCredentials: true
      });
      setClients(prev => prev.filter(client => client.userId !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Something went wrong while deleting the user.');
    }
  };

  // Handle client export

    const handleExportClients = () => {
  // Choose the clients you want to export (filtered, sorted, or all)
  const exportData = sortedClients.length ? sortedClients : clients;

  // Prepare CSV header
  const headers = ['First Name', 'Last Name', 'Email', 'Status', 'Joined'];
  const rows = exportData.map(client => [
    client.firstName,
    client.lastName,
    client.email,
    client.status,
    client.createdAt,
  ]);

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n');

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clients.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all client accounts</p>
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Clients',
            icon: <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            value: clients.length,
            trend: '12%',
            color: 'blue'
          },
          {
            label: 'Active Clients',
            icon: <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />,
            value: clients.filter(c => c.status === 'active').length,
            trend: '8%',
            color: 'green'
          },
          {
            label: 'New This Month',
            icon: <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            value: 12,
            trend: '-3%',
            color: 'purple'
          }
        ].map((stat, idx) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</h3>
              <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`text-green-500 flex items-center`}>
                <ChevronUp className="h-4 w-4" /> {stat.trend}
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter/Search/Sort */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    {['all', 'active', 'inactive'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          filterStatus === status ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : ''
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)} Clients
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleSortDirection}
                className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
              >
                {sortDirection === 'asc' ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" /> Oldest First
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" /> Newest First
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {sortedClients.map(client => (
                  <motion.tr key={client.userId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.firstName} {client.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-700 dark:text-gray-300">
                      {client.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {getRelativeTime(client.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => navigate(`/admin/client/view/${client.userId}`)} className="text-indigo-600 hover:text-indigo-900 mr-2"><Eye className="w-4 h-4" /></button>
                     
                      <button onClick={() => handleDelete(client.userId)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default ClientUsers;
