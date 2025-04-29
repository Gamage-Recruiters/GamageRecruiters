import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { mockPartners } from '../data/mockData';

function Partners() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Trusted Partners</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPartners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {partner.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{partner.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Partnership since: {partner.partnershipDate}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button className="p-2 text-gray-500 hover:text-indigo-600">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Partners;