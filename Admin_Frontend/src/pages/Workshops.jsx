import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar as CalendarIcon } from 'lucide-react';
import { mockWorkshops } from '../data/mockData';

function Workshops() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Workshops & Seminars</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Create Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWorkshops.map((workshop, index) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{workshop.title}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  workshop.status === 'upcoming'
                    ? 'bg-green-100 text-green-800'
                    : workshop.status === 'ongoing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {workshop.status}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-gray-500">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{workshop.registered} / {workshop.capacity} registered</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {Math.round((workshop.registered / workshop.capacity) * 100)}% Full
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{ width: `${(workshop.registered / workshop.capacity) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Workshops;