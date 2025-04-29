import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBriefcase, FaBlog, FaStar, FaClipboardList } from "react-icons/fa";

const stats = [
  { title: "Total Clients", value: "1,250", icon: <FaUsers className="text-blue-500 text-3xl" /> },
  { title: "Active Jobs", value: "245", icon: <FaBriefcase className="text-green-500 text-3xl" /> },
  { title: "Blog Posts", value: "98", icon: <FaBlog className="text-purple-500 text-3xl" /> },
  { title: "Trusted Partners", value: "32", icon: <FaStar className="text-yellow-500 text-3xl" /> },
  { title: "Applications", value: "4,300", icon: <FaClipboardList className="text-red-500 text-3xl" /> },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200 hover:shadow-2xl transition duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {stat.icon}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{stat.title}</h2>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
