import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaDownload, FaTrash, FaSave } from 'react-icons/fa';

const ApplicationDetailView = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formChanged, setFormChanged] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resume, setResume] = useState(null);
  
  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  
  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/applications/application/${applicationId}`);
      setApplication(response.data.data[0]);
      
      // Set form fields
      setFirstName(response.data.data[0].firstName);
      setLastName(response.data.data[0].lastName);
      setEmail(response.data.data[0].email);
      setPhoneNumber(response.data.data[0].phoneNumber);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch application details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResume = (e) => {
    setResume(e.target.files[0]);
    setFormChanged(true);
  };
  
  const handleInputChange = () => {
    setFormChanged(true);
  };
  
  const updateApplication = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    
    if (resume) {
      formData.append('resume', resume);
    }
    
    try {
      setLoading(true);
      await axios.put(`/api/applications/update/${applicationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFormChanged(false);
      fetchApplicationDetails(); // Refresh data
      setError(null);
    } catch (err) {
      setError('Failed to update application. Please check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadCV = async () => {
    if (!application?.resume) return;
    
    try {
      const response = await axios.get(`http://localhost:8000/api/applications/download/${applicationId}`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', application.resume);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download CV. Please try again.');
      console.error(err);
    }
  };
  
  const deleteApplication = async () => {
    try {
      await axios.delete(`/api/applications/delete/${applicationId}`);
      // Redirect back to jobs page
      navigate('/applications');
    } catch (err) {
      setError('Failed to delete application. Please try again.');
      console.error(err);
      setShowDeleteModal(false);
    }
  };
  
  // Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this application? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={deleteApplication}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
  
  if (loading && !application) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <p className="text-xl">Loading application details...</p>
        </div>
      </div>
    );
  }
  
  if (error && !application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/applications')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <FaArrowLeft className="mr-2" /> Back to Applications
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {showDeleteModal && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/applications')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Applications
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={downloadCV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={!application?.resume}
          >
            <FaDownload className="mr-2" /> Download CV
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 pb-2 border-b">
          Application Details
        </h1>
        
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium">{application?.jobName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{application?.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Applied Date</p>
              <p className="font-medium">
                {application?.appliedDate && new Date(application.appliedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={updateApplication} className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  handleInputChange();
                }}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  handleInputChange();
                }}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  handleInputChange();
                }}
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV</label>
              <div className="flex flex-col space-y-2">
                {application?.resume && (
                  <div className="text-sm">
                    Current file: <span className="font-medium">{application.resume}</span>
                  </div>
                )}
                <input
                  type="file"
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={handleResume}
                />
                <p className="text-xs text-gray-500">
                  Upload a new file only if you want to replace the current resume.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className={`flex items-center justify-center w-full py-3 rounded-lg font-semibold transition ${
                formChanged
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formChanged || loading}
            >
              {loading ? (
                <span>Updating...</span>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationDetailView;