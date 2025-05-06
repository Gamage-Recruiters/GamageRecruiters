import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiTrash2, FiSearch, FiFilter, FiUser, FiMail, FiPhone, FiCalendar, FiFile, FiArchive, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CandidateDetailsView = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterJobId, setFilterJobId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: null, id: null });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const baseUrl = 'http://localhost:8000';

  // Fetch data on component mount
  useEffect(() => {
    fetchJobs();
    fetchAllApplications();
    fetchStatistics();
  }, []);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/jobs`);
      setJobs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs data.');
    }
  };

  // Fetch all applications
  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/jobapplications/applications`);
      setApplications(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications data.');
      setLoading(false);
    }
  };

  // Fetch applications for a specific job
  const fetchApplicationsByJob = async (jobId) => {
    if (jobId === 'all') {
      return fetchAllApplications();
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/jobapplications/jobs/${jobId}/applications`);
      setApplications(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications for job:', err);
      setError(`Failed to load applications for job ID ${jobId}.`);
      setLoading(false);
    }
  };

  // Fetch job statistics
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/jobs/statistics`);
      setStatistics(response.data.data || []);
    } catch (err) {
      console.error('Error fetching job statistics:', err);
    }
  };

  // Handle job filter change
  const handleFilterChange = (e) => {
    const jobId = e.target.value;
    setFilterJobId(jobId);
    fetchApplicationsByJob(jobId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle application selection for bulk actions
  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => {
      if (prev.includes(applicationId)) {
        return prev.filter(id => id !== applicationId);
      } else {
        return [...prev, applicationId];
      }
    });
  };

  // Select/deselect all applications
  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.applicationId));
    }
  };

  // Download individual resume
  const downloadResume = async (applicationId) => {
    try {
      window.open(`${baseUrl}/api/jobapplications/applications/download/${applicationId}`, '_blank');
      showToastMessage('Resume download started', 'success');
    } catch (err) {
      console.error('Error downloading resume:', err);
      showToastMessage('Failed to download resume', 'error');
    }
  };

  // Download all resumes for a job
  const downloadAllResumes = async (jobId) => {
    try {
      window.open(`${baseUrl}/api/jobapplications/jobs/${jobId}/applications/download-all`, '_blank');
      showToastMessage('Bulk download started', 'success');
    } catch (err) {
      console.error('Error downloading all resumes:', err);
      showToastMessage('Failed to download all resumes', 'error');
    }
  };

  // Delete individual application
  const deleteApplication = async (applicationId) => {
    try {
      await axios.delete(`${baseUrl}/api/jobapplications/delete/${applicationId}`);
      setApplications(applications.filter(app => app.applicationId !== applicationId));
      showToastMessage('Application deleted successfully', 'success');
      fetchStatistics(); // Refresh statistics after deletion
    } catch (err) {
      console.error('Error deleting application:', err);
      showToastMessage('Failed to delete application', 'error');
    }
  };

  // Delete all applications for a job
  const deleteAllApplications = async (jobId) => {
    try {
      await axios.delete(`${baseUrl}/api/jobapplications/jobs/${jobId}/applications/delete-all`);
      if (filterJobId === jobId || filterJobId === 'all') {
        // If we're viewing the job that was deleted or all jobs, refresh the view
        fetchApplicationsByJob(filterJobId);
      }
      showToastMessage('All applications for this job deleted successfully', 'success');
      fetchStatistics(); // Refresh statistics after deletion
    } catch (err) {
      console.error('Error deleting all applications:', err);
      showToastMessage('Failed to delete applications', 'error');
    }
  };

  // Delete selected applications
  const deleteSelectedApplications = async () => {
    try {
      for (const applicationId of selectedApplications) {
        await axios.delete(`${baseUrl}/api/jobapplications/delete/${applicationId}`);
      }
      setApplications(applications.filter(app => !selectedApplications.includes(app.applicationId)));
      setSelectedApplications([]);
      showToastMessage(`${selectedApplications.length} applications deleted successfully`, 'success');
      fetchStatistics(); // Refresh statistics after deletion
    } catch (err) {
      console.error('Error deleting selected applications:', err);
      showToastMessage('Failed to delete some applications', 'error');
    }
  };

  // Show confirmation modal
  const showConfirmationModal = (type, id) => {
    setConfirmAction({ type, id });
    setShowConfirmModal(true);
  };

  // Handle confirmation modal actions
  const handleConfirmAction = () => {
    const { type, id } = confirmAction;
    
    if (type === 'deleteOne') {
      deleteApplication(id);
    } else if (type === 'deleteAll') {
      deleteAllApplications(id);
    } else if (type === 'deleteSelected') {
      deleteSelectedApplications();
    }
    
    setShowConfirmModal(false);
  };

  // Show toast message
  const showToastMessage = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(app => {
    const searchString = searchTerm.toLowerCase();
    return (
      app.firstName?.toLowerCase().includes(searchString) ||
      app.lastName?.toLowerCase().includes(searchString) ||
      app.email?.toLowerCase().includes(searchString) ||
      app.phoneNumber?.toLowerCase().includes(searchString) ||
      app.jobName?.toLowerCase().includes(searchString) ||
      app.company?.toLowerCase().includes(searchString)
    );
  });

  // Get job name from job ID
  const getJobName = (jobId) => {
    const job = jobs.find(j => j.jobId === jobId);
    return job ? `${job.jobName} at ${job.company}` : 'Unknown Job';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Candidate Applications</h1>
        <p className="text-gray-600 mt-2">Manage and review all job applications</p>
      </div>

      {/* Stats Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FiUser size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold">{applications.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FiFile size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Jobs</p>
                <h3 className="text-2xl font-bold">{jobs.filter(job => job.status === 'Active').length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FiArchive size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Applications Today</p>
                <h3 className="text-2xl font-bold">
                  {applications.filter(app => {
                    const today = new Date();
                    const appDate = new Date(app.appliedDate);
                    return (
                      appDate.getDate() === today.getDate() &&
                      appDate.getMonth() === today.getMonth() &&
                      appDate.getFullYear() === today.getFullYear()
                    );
                  }).length}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <FiCalendar size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Last Application</p>
                <h3 className="text-lg font-bold">
                  {applications.length > 0 
                    ? formatDate(applications.sort((a, b) => 
                        new Date(b.appliedDate) - new Date(a.appliedDate)
                      )[0].appliedDate)
                    : 'None'}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Job Filter */}
            <div className="relative w-full md:w-64">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={filterJobId}
                onChange={handleFilterChange}
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.jobId} value={job.jobId}>
                    {job.jobName} - {job.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-3">
              {filterJobId !== 'all' && (
                <button
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => downloadAllResumes(filterJobId)}
                >
                  <FiDownload /> Download All CVs
                </button>
              )}
              
              {selectedApplications.length > 0 && (
                <button
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  onClick={() => showConfirmationModal('deleteSelected')}
                >
                  <FiTrash2 /> Delete Selected ({selectedApplications.length})
                </button>
              )}
              
              {filterJobId !== 'all' && (
                <button
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  onClick={() => showConfirmationModal('deleteAll', filterJobId)}
                >
                  <FiTrash2 /> Delete All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FiFile className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map(application => (
                  <tr 
                    key={application.applicationId}
                    className={selectedApplications.includes(application.applicationId) ? "bg-blue-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.applicationId)}
                        onChange={() => handleSelectApplication(application.applicationId)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                          {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.firstName} {application.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiMail className="mr-2 text-gray-400" />
                          {application.email}
                        </div>
                        <div className="text-sm text-gray-900 flex items-center mt-1">
                          <FiPhone className="mr-2 text-gray-400" />
                          {application.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.jobName || getJobName(application.jobType)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(application.appliedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => downloadResume(application.applicationId)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download Resume"
                        >
                          <FiDownload />
                        </button>
                        <button 
                          onClick={() => showConfirmationModal('deleteOne', application.applicationId)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Application"
                        >
                          <FiTrash2 />
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6">
              {confirmAction.type === 'deleteOne' && "Are you sure you want to delete this application? This will also remove the candidate's resume."}
              {confirmAction.type === 'deleteAll' && "Are you sure you want to delete ALL applications for this job? This will remove all resumes as well."}
              {confirmAction.type === 'deleteSelected' && `Are you sure you want to delete ${selectedApplications.length} selected applications? This will remove all associated resumes.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
          toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default CandidateDetailsView;