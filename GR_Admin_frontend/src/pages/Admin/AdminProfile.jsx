import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle, 
  Calendar, 
  Loader2 
} from 'lucide-react';

function AdminProfile() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    role: '',
    status: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    adminPhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        // Use the current admin ID from localStorage if not provided in URL
        const currentAdminId = adminId || localStorage.getItem('adminId');
        
        if (currentAdminId) {
          navigate('/login');
          return;
        }
        
        const response = await fetch(`/api/admin/${currentAdminId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        
        const data = await response.json();
        setAdminData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          gender: data.gender || '',
          role: data.role || '',
          status: data.status || '',
          primaryPhoneNumber: data.primaryPhoneNumber || '',
          secondaryPhoneNumber: data.secondaryPhoneNumber || '',
          adminPhoto: null
        });
        
        if (data.image) {
          setPreviewImage(`/uploads/admin/${data.image}`);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, [adminId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        adminPhoto: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setError('');
      setSuccess('');
      
      const currentAdminId = adminId || localStorage.getItem('adminId');
      if (!currentAdminId) {
        setError('Admin ID not found');
        return;
      }
      
      // Create form data for file upload
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('gender', formData.gender);
      formDataObj.append('role', formData.role);
      formDataObj.append('status', formData.status);
      formDataObj.append('primaryPhoneNumber', formData.primaryPhoneNumber);
      formDataObj.append('secondaryPhoneNumber', formData.secondaryPhoneNumber);
      
      if (formData.adminPhoto) {
        formDataObj.append('adminPhoto', formData.adminPhoto);
      }
      
      const response = await fetch(`/api/admin/update/${currentAdminId}`, {
        method: 'PUT',
        body: formDataObj,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update profile');
      }
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Refresh admin data
      const updatedDataResponse = await fetch(`/api/admin/${currentAdminId}`);
      if (updatedDataResponse.ok) {
        const updatedData = await updatedDataResponse.json();
        setAdminData(updatedData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with profile info and actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={adminData?.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 dark:border-purple-900" 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <UserCircle className="h-12 w-12" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {adminData?.name || 'Admin User'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {adminData?.role || 'Administrator'} · {adminData?.status || 'Active'}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    disabled={submitLoading}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center space-x-1"
                  >
                    {submitLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Alert messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Basic Info Section */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information
                </p>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <UserCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <label className={`
                        px-3 py-2 text-xs rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isEditing 
                          ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 cursor-pointer' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                      `}>
                        <span>Change Photo</span>
                        <input 
                          type="file" 
                          name="adminPhoto" 
                          onChange={handleFileChange}
                          disabled={!isEditing}
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                      
                      {previewImage && isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(adminData?.image ? `/uploads/admin/${adminData.image}` : null);
                            setFormData({
                              ...formData,
                              adminPhoto: null
                            });
                          }}
                          className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`
                      w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm 
                      ${isEditing 
                        ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                    `}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`
                          block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                          ${isEditing 
                            ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                        `}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`
                      block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                      ${isEditing 
                        ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your phone numbers
                </p>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Primary Phone Number */}
                <div>
                  <label htmlFor="primaryPhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Phone Number
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="primaryPhoneNumber"
                        name="primaryPhoneNumber"
                        value={formData.primaryPhoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`
                          block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                          ${isEditing 
                            ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                        `}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Secondary Phone Number */}
                <div>
                  <label htmlFor="secondaryPhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secondary Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="secondaryPhoneNumber"
                        name="secondaryPhoneNumber"
                        value={formData.secondaryPhoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`
                          block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                          ${isEditing 
                            ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                        `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Admin Settings */}
            <div>
              <div className="px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Admin Settings</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Admin role and status information
                </p>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin Role
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={!isEditing || adminData?.role === 'Super Admin'}
                        className={`
                          block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                          ${isEditing && adminData?.role !== 'Super Admin'
                            ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                  {adminData?.role === 'Super Admin' && isEditing && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Super Admin role cannot be changed
                    </p>
                  )}
                </div>
                
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`
                      block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm
                      ${isEditing 
                        ? 'bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            {isEditing && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: adminData?.name || '',
                      email: adminData?.email || '',
                      gender: adminData?.gender || '',
                      role: adminData?.role || '',
                      status: adminData?.status || '',
                      primaryPhoneNumber: adminData?.primaryPhoneNumber || '',
                      secondaryPhoneNumber: adminData?.secondaryPhoneNumber || '',
                      adminPhoto: null
                    });
                    setPreviewImage(adminData?.image ? `/uploads/admin/${adminData.image}` : null);
                    setError('');
                    setSuccess('');
                  }}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
                >
                  {submitLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
          </form>
      </div>
    </div>
  );
}

export default AdminProfile;