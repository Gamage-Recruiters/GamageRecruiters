import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/admin/all')
      .then((response) => {
        if (Array.isArray(response.data?.data)) {
          setAdmins(response.data.data);
        } else {
          console.error("Expected array but got:", response.data);
          setAdmins([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching admins:", error);
        setAdmins([]);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      axios.delete(`http://localhost:8000/admin/delete/${id}`)
        .then(() => {
          setAdmins(prev => prev.filter(admin => admin.adminId !== id));
        })
        .catch((err) => {
          console.error('Delete failed:', err);
        });
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Admin Management</h1>
        <button
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => navigate("/admins/add")}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Admin
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search by name or email"
          className="px-3 py-2 w-full md:w-1/3 rounded-md bg-gray-800 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-white" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-gray-800 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-sm uppercase text-gray-300">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.adminId} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">{admin.adminId}</td>
                  <td className="px-4 py-3">{admin.name}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3 flex justify-center space-x-3">
                    <button
                      onClick={() => navigate(`/admins/view/${admin.adminId}`)}
                      className="text-blue-500 hover:text-blue-300"
                      title="View"
                    >
                      <User />
                    </button>
                    <button
                      onClick={() => navigate(`/admins/edit/${admin.adminId}`)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Edit"
                    >
                      <Edit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.adminId)}
                      className="text-red-500 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-400">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AdminUsers;
