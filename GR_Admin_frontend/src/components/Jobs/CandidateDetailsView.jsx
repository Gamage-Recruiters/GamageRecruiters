import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiDownload, FiTrash2, FiSearch, FiFilter, FiUser, FiMail, 
  FiPhone, FiCalendar, FiFile, FiArchive, FiCheckCircle, 
  FiAlertCircle, FiChevronDown, FiBriefcase, FiClock, FiEye
} from 'react-icons/fi';
import { createPortal } from 'react-dom';

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
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownTriggerRef = useRef(null);

  const baseUrl = 'http://localhost:8000';

  // to calculate dropdown position
  useEffect(() => {
    if (isFilterDropdownOpen && dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5, // 5px below the button
        left: rect.left + window.scrollX
      });
    }
  }, [isFilterDropdownOpen]);

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
    setJobs(response.data.jobs || []); // Changed from data.data to data.jobs
    console.log("Jobs response:", response.data); // Add this for debugging
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
  const handleFilterChange = (jobId) => {
    setFilterJobId(jobId);
    fetchApplicationsByJob(jobId);
    setIsFilterDropdownOpen(false);
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

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get random color for avatar background based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-indigo-800', 'bg-purple-800', 'bg-pink-800', 
      'bg-red-800', 'bg-orange-800', 'bg-amber-800',
      'bg-emerald-800', 'bg-teal-800', 'bg-cyan-800', 
      'bg-blue-800'
    ];
    
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Get today's applications count
  const getTodayApplicationsCount = () => {
    if (!applications.length) return 0;
    
    const today = new Date();
    return applications.filter(app => {
      const appDate = new Date(app.appliedDate);
      return (
        appDate.getDate() === today.getDate() &&
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear()
      );
    }).length;
  };

  // Get last application date
  const getLastApplicationDate = () => {
    if (!applications.length) return 'None';
    
    const sortedApps = [...applications].sort((a, b) => 
      new Date(b.appliedDate) - new Date(a.appliedDate)
    );
    
    return formatDate(sortedApps[0].appliedDate);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Candidate Applications
        </h1>
        <p className="text-gray-400 mt-2">Manage and review all job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-gray-800/30 border border-gray-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-900/50 text-indigo-400 mr-4">
                <FiUser size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold text-white">{applications.length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-gray-800/30 border border-gray-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-900/50 text-emerald-400 mr-4">
                <FiBriefcase size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Jobs</p>
                <h3 className="text-2xl font-bold text-white">{jobs.filter(job => job.status === 'Active').length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-gray-800/30 border border-gray-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-900/50 text-purple-400 mr-4">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Applications Today</p>
                <h3 className="text-2xl font-bold text-white">{getTodayApplicationsCount()}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-gray-800/30 border border-gray-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-900/50 text-amber-400 mr-4">
                <FiCalendar size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Application</p>
                <h3 className="text-lg font-bold text-white">{getLastApplicationDate()}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-gray-800 rounded-xl shadow-lg mb-8 border border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Job Filter - Custom dropdown */}
            <div className="relative w-full md:w-64">
              <div 
                ref={dropdownTriggerRef}
                className="flex items-center justify-between pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <span>
                  {filterJobId === 'all' 
                    ? 'All Jobs' 
                    : getJobName(filterJobId)}
                </span>
                <FiChevronDown className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isFilterDropdownOpen && createPortal(
                <>
                  <div 
                    className="fixed inset-0 bg-transparent z-40" 
                    onClick={() => setIsFilterDropdownOpen(false)}
                  ></div>
                  <div 
                    className="fixed z-50 bg-gray-700 border border-gray-600 rounded-lg shadow-xl py-2 max-h-72 overflow-y-auto"
                    style={{
                      width: "250px",
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`
                    }}
                  >
                    <div 
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
                      onClick={() => handleFilterChange('all')}
                    >
                      All Jobs
                    </div>
                    {jobs.map(job => (
                      <div 
                        key={job.jobId} 
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
                        onClick={() => handleFilterChange(job.jobId)}
                      >
                        {job.jobName} - {job.company}
                      </div>
                    ))}
                  </div>
                </>,
                document.body
              )}
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-3">
              {filterJobId !== 'all' && (
                <button
                  className="flex items-center gap-2 bg-indigo-900/50 text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors border border-indigo-700/50"
                  onClick={() => downloadAllResumes(filterJobId)}
                >
                  <FiDownload /> Download All CVs
                </button>
              )}
              
              {selectedApplications.length > 0 && (
                <button
                  className="flex items-center gap-2 bg-red-900/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-800 transition-colors border border-red-700/50"
                  onClick={() => showConfirmationModal('deleteSelected')}
                >
                  <FiTrash2 /> Delete Selected ({selectedApplications.length})
                </button>
              )}
              
              {filterJobId !== 'all' && (
                <button
                  className="flex items-center gap-2 bg-red-900/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-800 transition-colors border border-red-700/50"
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
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <FiAlertCircle className="text-red-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-400">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FiFile className="text-gray-500 text-5xl mx-auto mb-4" />
            <p className="text-gray-400">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredApplications.map(application => (
                  <tr 
                    key={application.applicationId}
                    className={selectedApplications.includes(application.applicationId) 
                      ? "bg-indigo-900/20 hover:bg-indigo-900/30" 
                      : "hover:bg-gray-700/50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.applicationId)}
                        onChange={() => handleSelectApplication(application.applicationId)}
                        className="rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 ${getAvatarColor(`${application.firstName} ${application.lastName}`)} rounded-full flex items-center justify-center text-white font-medium`}>
                          {getInitials(application.firstName, application.lastName)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {application.firstName} {application.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-300 flex items-center">
                          <FiMail className="mr-2 text-gray-400" />
                          {application.email}
                        </div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <FiPhone className="mr-2 text-gray-400" />
                          {application.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-200">
                        {application.jobName || getJobName(application.jobType)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {application.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {formatDate(application.appliedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => downloadResume(application.applicationId)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Download Resume"
                        >
                          <FiDownload />
                        </button>
                        <button
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="View Application"
                        >
                          <FiEye />
                        </button>
                        <button 
                          onClick={() => showConfirmationModal('deleteOne', application.applicationId)}
                          className="text-red-400 hover:text-red-300 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <h3 className="text-lg font-medium text-gray-100 mb-4">Confirm Action</h3>
            <p className="text-gray-300 mb-6">
              {confirmAction.type === 'deleteOne' && "Are you sure you want to delete this application? This will also remove the candidate's resume."}
              {confirmAction.type === 'deleteAll' && "Are you sure you want to delete ALL applications for this job? This will remove all resumes as well."}
              {confirmAction.type === 'deleteSelected' && `Are you sure you want to delete ${selectedApplications.length} selected applications? This will remove all associated resumes.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        <div className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-lg flex items-center space-x-2 border ${
          toast.type === 'success' 
            ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700' 
            : 'bg-red-900/90 text-red-100 border-red-700'
        } backdrop-blur-sm`}>
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default CandidateDetailsView;