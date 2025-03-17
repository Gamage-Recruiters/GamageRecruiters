import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const AdminUsers = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;
    setAdmins([...admins, { id: Date.now(), ...newAdmin }]);
    setNewAdmin({ name: "", email: "" });
  };

  const handleEditAdmin = (id) => {
    const admin = admins.find((a) => a.id === id);
    setNewAdmin(admin);
    setEditingId(id);
  };

  const handleUpdateAdmin = () => {
    setAdmins(admins.map((a) => (a.id === editingId ? newAdmin : a)));
    setNewAdmin({ name: "", email: "" });
    setEditingId(null);
  };

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin User Management
      </motion.h1>
      
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border rounded-lg"
          value={newAdmin.name}
          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-lg"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
        />
        {editingId ? (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={handleUpdateAdmin}
          >
            Update
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleAddAdmin}
          >
            Add Admin
          </button>
        )}
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <motion.tr
                key={admin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b"
              >
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3 flex gap-3">
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => handleEditAdmin(admin.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAdmin(admin.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
