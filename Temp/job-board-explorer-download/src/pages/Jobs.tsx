
import React from 'react';
import Header from '../components/Header';
import JobsTable from '../components/JobsTable';
import { getAllJobs } from '../services/jobService';

const Jobs: React.FC = () => {
  // In a real app, this would likely use state and fetch from an API
  const jobs = getAllJobs();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Job Listings</h2>
          <div className="flex space-x-2">
            <span className="text-sm text-gray-500 self-center">
              Total Jobs: <span className="font-medium">{jobs.length}</span>
            </span>
          </div>
        </div>
        <JobsTable jobs={jobs} />
      </main>
      <footer className="bg-white shadow-sm border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JobBoard Explorer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Jobs;
