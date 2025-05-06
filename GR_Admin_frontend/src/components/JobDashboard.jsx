import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiTrash2, FiRefreshCw, FiSearch, FiEye, FiFileText, FiFilePlus, FiUsers, FiBarChart2, FiAlertCircle } from 'react-icons/fi';

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/jobs');
      setJobs(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch job statistics
  const fetchJobStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/jobapplications/jobs/statistics');
      console.log("statistic data" ,res);
      console.log("statistic data" ,res.data.data);
      setStats(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching job statistics:', err);
      setError('Failed to load job statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for a specific job
  const fetchApplicationsByJob = async (jobId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/jobapplications/jobs/${jobId}/applications`);
      setApplications(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchJobs();
    fetchJobStats();
  }, []);

  // Download single resume
  const downloadResume = async (applicationId) => {
    try {
      window.open(`http://localhost:8000/api/jobapplications/applications/download/${applicationId}`, '_blank');
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError('Failed to download resume. Please try again.');
    }
  };

  // Download all resumes as zip
  const downloadAllResumes = async (jobId) => {
    try {
      window.open(`http://localhost:8000/api/jobapplications/jobs/${jobId}/applications/download-all`, '_blank');
    } catch (err) {
      console.error('Error downloading all resumes:', err);
      setError('Failed to download all resumes. Please try again.');
    }
  };

  // Delete all applications for a job
  const deleteAllApplications = async (jobId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/jobapplications/jobs/${jobId}/applications/delete-all`);
      setApplications([]);
      fetchJobStats(); // Refresh stats after deletion
      setError(null);
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    } catch (err) {
      console.error('Error deleting applications:', err);
      setError('Failed to delete applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle job selection
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchApplicationsByJob(job.jobId);
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.jobName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Job Dashboard</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => { fetchJobs(); fetchJobStats(); }}
                className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiRefreshCw className="mr-2" /> Refresh
              </button>
              <button 
                onClick={() => setShowStats(!showStats)}
                className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FiBarChart2 className="mr-2" /> {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-100">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Job Statistics */}
        {showStats && stats && (
          <div className="mb-6 bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-blue-400">Job Statistics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applications</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">First Application</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Application</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {stats.map((stat) => (
                    <tr key={stat.jobId} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{stat.jobName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stat.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                          {stat.applicationCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {stat.firstApplication ? new Date(stat.firstApplication).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {stat.lastApplication ? new Date(stat.lastApplication).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Search Bar & Job List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center bg-gray-700 rounded-md px-3 py-2">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="bg-transparent border-none w-full text-white focus:outline-none placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              {loading && !jobs.length ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {filteredJobs.map((job) => (
                    <li 
                      key={job.jobId} 
                      className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedJob?.jobId === job.jobId ? 'bg-gray-700 border-l-4 border-blue-500' : ''}`}
                      onClick={() => handleJobSelect(job)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-white">{job.jobName}</h3>
                          <p className="text-xs text-gray-400">{job.company}</p>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                          {stats?.find(s => s.jobId === job.jobId)?.applicationCount || 0}
                        </span>
                      </div>
                    </li>
                  ))}
                  {filteredJobs.length === 0 && (
                    <li className="p-4 text-center text-gray-400">No jobs found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Applications List */}
          <div className="md:col-span-2 bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-blue-400">
                {selectedJob ? `Applications for ${selectedJob.jobName}` : 'Select a job to view applications'}
              </h3>
              {selectedJob && applications.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadAllResumes(selectedJob.jobId)}
                    className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiDownload className="mr-2" /> Download All CVs
                  </button>
                  <button
                    onClick={() => {
                      setJobToDelete(selectedJob);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="mr-2" /> Delete All
                  </button>
                </div>
              )}
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && jobToDelete && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-medium text-red-400 mb-4">Confirm Deletion</h3>
                  <p className="text-white mb-6">
                    Are you sure you want to delete all applications and resumes for <span className="font-bold">{jobToDelete.jobName}</span>? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteAllApplications(jobToDelete.jobId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && selectedJob ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {selectedJob ? (
                  applications.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applicant</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applied Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {applications.map((application) => (
                          <tr key={application.applicationId} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-white">
                                  {application.firstName} {application.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{application.email}</div>
                              <div className="text-sm text-gray-400">{application.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(application.appliedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => downloadResume(application.applicationId)}
                                  className="flex items-center text-green-400 hover:text-green-300"
                                  title="Download CV"
                                >
                                  <FiDownload className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => window.location.href = `/application/${application.applicationId}`}
                                  className="flex items-center text-blue-400 hover:text-blue-300"
                                  title="View Details"
                                >
                                  <FiEye className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <FiFileText className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                      <p>No applications found for this job.</p>
                    </div>
                  )
                ) : (
                  <div className="p-12 text-center text-gray-400">
                    <FiFilePlus className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg">Select a job from the list to view applications</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}