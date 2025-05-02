import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartBar, 
  FaDownload, 
  FaTrash, 
  FaEye, 
  FaFileAlt, 
  FaUserFriends,
  FaCalendarAlt,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const JobDashboard = () => {
  const [jobStats, setJobStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('applicationCount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobStatistics();
  }, []);

const fetchJobStatistics = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:8000/api/jobs');
    
    // Validate response structure
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }

    setJobStats(response.data);
    setError(null);
  } catch (err) {
    setError(err.message || 'Failed to fetch job statistics. Please try again later.');
    console.error('Fetch error:', err.response?.data || err.message);
    // Reset to empty array on error
    setJobStats([]);
  } finally {
    setLoading(false);
  }
};

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const downloadAllCVsForJob = async (jobId, jobName) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/jobs/${jobId}/applications/download-all`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${jobName.replace(/\s+/g, '_')}_resumes.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download resumes. Please try again.');
      console.error(err);
    }
  };

  const confirmDeleteAllApplications = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const deleteAllApplications = async () => {
    if (!jobToDelete) return;
    
    try {
      await axios.delete(`/api/jobs/${jobToDelete}/applications/delete-all`);
      fetchJobStatistics(); // Refresh data
      setError(null);
    } catch (err) {
      setError('Failed to delete applications. Please try again.');
      console.error(err);
    } finally {
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  // Filter and sort jobs
  const filteredJobs = jobStats.filter(job => 
    job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'applicationCount') {
      return sortOrder === 'asc' 
        ? a.applicationCount - b.applicationCount 
        : b.applicationCount - a.applicationCount;
    } else if (sortBy === 'jobName') {
      return sortOrder === 'asc'
        ? a.jobName.localeCompare(b.jobName)
        : b.jobName.localeCompare(a.jobName);
    } else if (sortBy === 'company') {
      return sortOrder === 'asc'
        ? a.company.localeCompare(b.company)
        : b.company.localeCompare(a.company);
    } else if (sortBy === 'lastApplication') {
      const dateA = a.lastApplication ? new Date(a.lastApplication) : new Date(0);
      const dateB = b.lastApplication ? new Date(b.lastApplication) : new Date(0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete ALL applications for this job? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={deleteAllApplications}
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications Dashboard</h1>
        <Link
          to="/applications"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaUserFriends className="mr-2" /> View All Applications
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600"><FaFilter className="inline mr-1" /> Sort by:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="applicationCount">Application Count</option>
              <option value="jobName">Job Title</option>
              <option value="company">Company</option>
              <option value="lastApplication">Last Application</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">Loading job statistics...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('jobName')}
                  >
                    Job Title {sortBy === 'jobName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('company')}
                  >
                    Company {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('applicationCount')}
                  >
                    Applications {sortBy === 'applicationCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastApplication')}
                  >
                    Last Application {sortBy === 'lastApplication' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.jobId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{job.jobName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserFriends className="text-blue-500 mr-2" />
                        <span className="font-medium">{job.applicationCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.lastApplication ? (
                        <div className="flex items-center text-gray-900">
                          <FaCalendarAlt className="text-gray-500 mr-2" />
                          {new Date(job.lastApplication).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">No applications</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link 
                          to={`/jobs/${job.jobId}/applications`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Applications"
                        >
                          <FaEye size={18} />
                        </Link>
                        <button
                          onClick={() => downloadAllCVsForJob(job.jobId, job.jobName)}
                          className={`text-green-600 hover:text-green-800 ${job.applicationCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={job.applicationCount === 0}
                          title="Download All CVs"
                        >
                          <FaDownload size={18} />
                        </button>
                        <button
                          onClick={() => confirmDeleteAllApplications(job.jobId)}
                          className={`text-red-600 hover:text-red-800 ${job.applicationCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={job.applicationCount === 0}
                          title="Delete All Applications"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <p className="text-2xl font-bold">{jobStats.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Applications</p>
              <p className="text-2xl font-bold">
                {jobStats.reduce((sum, job) => sum + job.applicationCount, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserFriends className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Applications per Job</p>
              <p className="text-2xl font-bold">
                {jobStats.length > 0 
                  ? (jobStats.reduce((sum, job) => sum + job.applicationCount, 0) / jobStats.length).toFixed(1) 
                  : '0'}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaChartBar className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Most Recent Application</p>
              <p className="text-2xl font-bold">
                {jobStats.length > 0 && jobStats.some(job => job.lastApplication)
                  ? new Date(Math.max(...jobStats
                      .filter(job => job.lastApplication)
                      .map(job => new Date(job.lastApplication).getTime())))
                      .toLocaleDateString()
                  : 'None'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;