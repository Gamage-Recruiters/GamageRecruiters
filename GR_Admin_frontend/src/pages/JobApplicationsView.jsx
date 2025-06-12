import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash, FaEye, FaFileDownload } from 'react-icons/fa';
import baseURL from '../config/baseUrlConfig';

const JobApplicationsView = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/jobs`);
      setJobs(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/jobs/${jobId}/applications`);
      setApplications(response.data.data);
      setError(null);
    } catch (err) {
      setApplications([]);
      setError('Failed to fetch applications for this job.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchApplicationsForJob(job.jobId);
  };

  const downloadCV = async (applicationId, fileName) => {
    try {
      const response = await axios.get(`${baseURL}/api/applications/download/${applicationId}`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download CV. Please try again.');
      console.error(err);
    }
  };

  const downloadAllCVs = async () => {
    if (!selectedJob) return;
    
    try {
      const response = await axios.get(`${baseURL}/api/jobs/${selectedJob.jobId}/applications/download-all`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedJob.jobName}-applications.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download all CVs. Please try again.');
      console.error(err);
    }
  };

  const showDeleteConfirmation = (id, type) => {
    setDeleteTarget(id);
    setDeleteType(type);
    setShowConfirmModal(true);
  };

  const deleteApplication = async (applicationId) => {
    try {
      await axios.delete(`${baseURL}/api/applications/delete/${applicationId}`);
      // Refresh applications list
      fetchApplicationsForJob(selectedJob.jobId);
      setError(null);
    } catch (err) {
      setError('Failed to delete application. Please try again.');
      console.error(err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const deleteAllApplications = async () => {
    if (!selectedJob) return;
    
    try {
      await axios.delete(`${baseURL}/api/jobs/${selectedJob.jobId}/applications/delete-all`);
      // Clear applications list
      setApplications([]);
      setError(null);
    } catch (err) {
      setError('Failed to delete all applications. Please try again.');
      console.error(err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleDelete = () => {
    if (deleteType === 'single') {
      deleteApplication(deleteTarget);
    } else if (deleteType === 'all') {
      deleteAllApplications();
    }
  };

  const viewApplication = (applicationId) => {
    // Navigate to application detail view
    window.location.href = `${baseURL}/api/applications/${applicationId}`;
  };

  // Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          {deleteType === 'single' 
            ? 'Are you sure you want to delete this application?' 
            : 'Are you sure you want to delete ALL applications for this job?'}
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {showConfirmModal && <DeleteConfirmationModal />}
      
      <h1 className="text-2xl font-bold mb-6">Job Applications Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Available Jobs</h2>
          
          {loading && jobs.length === 0 ? (
            <p className="text-center py-4">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center py-4">No jobs available</p>
          ) : (
            <ul className="divide-y">
              {jobs.map(job => (
                <li 
                  key={job.jobId} 
                  className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${selectedJob?.jobId === job.jobId ? 'bg-blue-50' : ''}`}
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="font-medium">{job.jobName}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Applications List */}
        <div className="bg-white shadow-lg rounded-lg p-4 md:col-span-2">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-semibold">
              {selectedJob ? `Applications for ${selectedJob.jobName}` : 'Select a job to view applications'}
            </h2>
            
            {selectedJob && applications.length > 0 && (
              <div className="flex space-x-2">
                <button 
                  onClick={downloadAllCVs}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaFileDownload className="mr-1" /> Download All CVs
                </button>
                <button 
                  onClick={() => showDeleteConfirmation(selectedJob.jobId, 'all')}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <FaTrash className="mr-1" /> Delete All
                </button>
              </div>
            )}
          </div>
          
          {!selectedJob ? (
            <p className="text-center py-12 text-gray-500">Select a job from the list to view applications</p>
          ) : loading ? (
            <p className="text-center py-12">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-center py-12 text-gray-500">No applications found for this job</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map(app => (
                    <tr key={app.applicationId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.firstName} {app.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.email}</div>
                        <div className="text-sm text-gray-500">{app.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewApplication(app.applicationId)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Application"
                          >
                            <FaEye />
                          </button>
                          <button 
                            onClick={() => downloadCV(app.applicationId, app.resume)}
                            className="text-green-600 hover:text-green-800"
                            title="Download CV"
                          >
                            <FaDownload />
                          </button>
                          <button 
                            onClick={() => showDeleteConfirmation(app.applicationId, 'single')}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Application"
                          >
                            <FaTrash />
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
      </div>
    </div>
  );
};

export default JobApplicationsView;