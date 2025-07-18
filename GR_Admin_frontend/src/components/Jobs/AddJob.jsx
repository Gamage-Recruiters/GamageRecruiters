import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  X, 
  Plus, 
  Minus, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  ListChecks, 
  FileText, 
  Award
} from 'lucide-react';
import axios from 'axios';
import baseURL from '../../config/baseUrlConfig';

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobName: '',
    company: '',
    jobLocation: '',
    jobType: 'Full-time',
    salaryRange: '',
    status: 'Active',
    jobDescription: '',
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    companyDescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleListChange = (e, index, field) => {
    const { value } = e.target;
    setFormData(prev => {
      const updatedList = [...prev[field]];
      updatedList[index] = value;
      return {
        ...prev,
        [field]: updatedList
      };
    });
  };

  const addListItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (index, field) => {
    setFormData(prev => {
      const updatedList = [...prev[field]];
      updatedList.splice(index, 1);
      return {
        ...prev,
        [field]: updatedList
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filter out empty list items
      const responsibilities = formData.responsibilities.filter(item => item.trim() !== '');
      const requirements = formData.requirements.filter(item => item.trim() !== '');
      const benefits = formData.benefits.filter(item => item.trim() !== '');
      
      // Format data for API
      const jobData = {
        jobName: formData.jobName,
        company: formData.company,
        jobLocation: formData.jobLocation,
        jobType: formData.jobType,
        salaryRange: formData.salaryRange,
        status: formData.status,
        jobDescription: formData.jobDescription,
        responsibilities: JSON.stringify(responsibilities),
        requirements: JSON.stringify(requirements),
        benefits: JSON.stringify(benefits),
        companyDescription: formData.companyDescription
      };
      
      // Send data to API endpoint
      const response = await axios.post(`${baseURL}/api/jobs/addjob`, jobData, {
        withCredentials: true
      });
      
      if (response.data) {
        // Show success toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn';
        toast.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Job added successfully!</span>
        `;
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
          toast.classList.add('animate-fadeOut');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
        
        // Redirect to jobs listing
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      
      // Show error toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>Failed to add job. Please try again.</span>
      `;
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <Briefcase size={24} className="text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create New Job
            </h1>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-700 w-full md:w-auto"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20 w-full md:w-auto"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Publish Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-5xl mx-auto bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl p-4 md:p-8 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Job Title</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="jobName"
                    required
                    value={formData.jobName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Company Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. Tech Solutions Ltd"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Location</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. Colombo"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Job Type</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <select
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 appearance-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Salary Range</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. LKR 80,000 - 100,000"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Status</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ListChecks size={16} className="text-gray-500" />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              Job Details
            </h2>
            
            <div className="space-y-6">
              {/* Job Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Job Description</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Describe the job role and responsibilities..."
                ></textarea>
                <p className="text-xs text-gray-400">Provide a detailed description of the job role to attract qualified candidates.</p>
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-400 flex items-center gap-1">
                  <span>Company Description</span>
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Tell candidates about your company culture, mission, and values..."
                ></textarea>
                <p className="text-xs text-gray-400">Highlight your company's culture and what makes it a great place to work.</p>
              </div>
            </div>
          </div>

          {/* Lists Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Responsibilities */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                  <ListChecks size={18} className="text-blue-400" />
                  Responsibilities
                </h2>
                <button
                  type="button"
                  onClick={() => addListItem('responsibilities')}
                  className="flex items-center gap-1 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 px-3 py-1 rounded-lg transition-all duration-300"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.responsibilities.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="bg-indigo-600/10 text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange(e, index, 'responsibilities')}
                      className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="e.g. Develop and maintain software applications"
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem(index, 'responsibilities')}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-400" />
                  Requirements
                </h2>
                <button
                  type="button"
                  onClick={() => addListItem('requirements')}
                  className="flex items-center gap-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 px-3 py-1 rounded-lg transition-all duration-300"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="bg-yellow-600/10 text-yellow-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange(e, index, 'requirements')}
                      className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="e.g. 5+ years of experience in software development"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem(index, 'requirements')}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                  <Award size={18} className="text-green-400" />
                  Benefits
                </h2>
                <button
                  type="button"
                  onClick={() => addListItem('benefits')}
                  className="flex items-center gap-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 px-3 py-1 rounded-lg transition-all duration-300"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.benefits.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="bg-green-600/10 text-green-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange(e, index, 'benefits')}
                      className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="e.g. Competitive salary and performance bonuses"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem(index, 'benefits')}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 font-medium text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Job Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;