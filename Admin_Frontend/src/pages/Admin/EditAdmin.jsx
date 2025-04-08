import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function EditAdmin() {
  const navigate = useNavigate();
  const { adminId } = useParams(); // Get admin ID from URL
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phoneNumber1: '',
    phoneNumber2: '',
    email: '',
    password: '',
    status: '',
    role: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Fetch admin data
  useEffect(() => {
    // In a real application, you would fetch the admin data from your API
    // For demo purposes, we're using mock data
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with your actual API call
        // const response = await fetch(`/api/admins/${adminId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockAdmin = {
          adminId: parseInt(adminId),
          name: "John Doe",
          gender: "Male",
          phoneNumber1: "+1 (555) 123-4567",
          phoneNumber2: "+1 (555) 987-6543",
          profilePic: "https://api.placeholder.com/150",
          email: "john.doe@example.com",
          password: "********", // Passwords should never be returned from API
          status: "active",
          role: "Super Admin"
        };
        
        setFormData({
          name: mockAdmin.name,
          gender: mockAdmin.gender,
          phoneNumber1: mockAdmin.phoneNumber1,
          phoneNumber2: mockAdmin.phoneNumber2 || '',
          email: mockAdmin.email,
          password: '', // Don't prefill password field
          status: mockAdmin.status,
          role: mockAdmin.role
        });
        
        setPreviewUrl(mockAdmin.profilePic);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        alert("Failed to load admin data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, [adminId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Track if password has been changed
    if (name === 'password' && value.length > 0) {
      setPasswordChanged(true);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.phoneNumber1) newErrors.phoneNumber1 = 'Primary phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation - only if password has been changed
    if (passwordChanged && formData.password.length > 0 && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.role) newErrors.role = 'Role selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would normally send the data to your API
      console.log('Form submitted:', { 
        adminId, 
        ...formData, 
        profilePic,
        passwordChanged
      });
      
      // Simulate successful submission
      alert('Admin updated successfully!');
      navigate('/admins'); // Redirect to admin list page
    } else {
      console.log('Form has errors');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-300">Loading admin data...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-6"
    >
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/admins')}
          className="mr-4 p-2 text-gray-300 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-100">Edit Admin</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile picture upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-700 mb-2">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => document.getElementById('profile-upload').click()}
                className="absolute bottom-2 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label className="text-sm text-gray-400">
              Upload New Profile Picture
            </label>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.name ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.gender ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
            </div>

            {/* Phone Number 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Primary Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber1"
                value={formData.phoneNumber1}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.phoneNumber1 ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter primary phone number"
              />
              {errors.phoneNumber1 && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber1}</p>}
            </div>

            {/* Phone Number 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Secondary Phone Number <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phoneNumber2"
                value={formData.phoneNumber2}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter secondary phone number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.email ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password <span className="text-gray-500">(Leave blank to keep current)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`px-4 py-2 w-full border ${errors.password ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`px-4 py-2 w-full border ${errors.role ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select Role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Content Admin">Content Admin</option>
                <option value="Support Admin">Support Admin</option>
                <option value="Technical Admin">Technical Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-300">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-300">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Admin ID (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Admin ID
            </label>
            <input
              type="text"
              value={adminId}
              readOnly
              className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg w-full md:w-1/3 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">Admin ID cannot be changed</p>
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admins')}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Update Admin
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditAdmin;