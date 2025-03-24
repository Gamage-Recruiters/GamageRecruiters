import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Mock data for admins - replace with your actual data source
const mockAdmins = [
  {
    adminId: 1,
    name: "John Doe",
    gender: "Male",
    phoneNumber1: "+1 (555) 123-4567",
    phoneNumber2: "+1 (555) 987-6543",
    profilePic: "https://api.placeholder.com/150",
    email: "john.doe@example.com",
    status: "active",
    role: "Super Admin"
  },
  {
    adminId: 2,
    name: "Jane Smith",
    gender: "Female",
    phoneNumber1: "+1 (555) 234-5678",
    phoneNumber2: "",
    profilePic: "https://api.placeholder.com/150",
    email: "jane.smith@example.com",
    status: "active",
    role: "Content Admin"
  },
  {
    adminId: 3,
    name: "Robert Johnson",
    gender: "Male",
    phoneNumber1: "+1 (555) 345-6789",
    phoneNumber2: "+1 (555) 111-2222",
    profilePic: "https://api.placeholder.com/150",
    email: "robert.johnson@example.com",
    status: "inactive",
    role: "Support Admin"
  },
  {
    adminId: 4,
    name: "Emily Williams",
    gender: "Female",
    phoneNumber1: "+1 (555) 456-7890",
    phoneNumber2: "",
    profilePic: "https://api.placeholder.com/150",
    email: "emily.williams@example.com",
    status: "active",
    role: "Technical Admin"
  }
];

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  // Filter admins based on search term and filters
  const filteredAdmins = mockAdmins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phoneNumber1.includes(searchTerm);
    
    const matchesRole = roleFilter === '' || admin.role === roleFilter;
    const matchesStatus = statusFilter === '' || admin.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Admin Management</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"    onClick={() => navigate("/admins/add")}>
          <Plus className="h-5 w-5 mr-2" />
          Add New Admin
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search admins by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Content Admin">Content Admin</option>
              <option value="Support Admin">Support Admin</option>
              <option value="Technical Admin">Technical Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Admin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredAdmins.map((admin, index) => (
                <motion.tr 
                  key={admin.adminId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {admin.profilePic ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={admin.profilePic} 
                            alt={admin.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200">{admin.name}</div>
                        <div className="text-sm text-gray-400">{admin.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{admin.email}</div>
                    <div className="text-sm text-gray-400">{admin.phoneNumber1}</div>
                    {admin.phoneNumber2 && (
                      <div className="text-sm text-gray-400">{admin.phoneNumber2}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {admin.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {admin.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {admin.status === 'active' ? (
                        <button className="p-2 text-gray-400 hover:text-red-400" title="Deactivate">
                          <UserX className="h-5 w-5" />
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-green-400" title="Activate">
                          <UserCheck className="h-5 w-5" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-indigo-400"
                          title="Edit"
                          onClick={() => navigate(`/admins/edit/1`)}
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                      <button className="p-2 text-gray-400 hover:text-red-400" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">No admins found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AdminUsers;


