import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Minus, Sparkles, Briefcase, Send } from 'lucide-react';
import axios from 'axios';

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobName: '',
    company: '',
    jobLocation: '',
    jobType: 'Full-time',
    salaryRange: '',
    status: 'Draft',
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
      const response = await axios.post('http://localhost:8000/api/jobs/addjob', jobData);
      
      if (response.data) {
        // Show success notification
        alert('Job added successfully!');
        // Redirect to jobs listing
        navigate(-1);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Briefcase size={28} className="text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create New Job
            </h1>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-600"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20"
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Job Title<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="jobName"
                required
                value={formData.jobName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                placeholder="e.g. Software Engineer"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Company Name<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                placeholder="e.g. Tech Solutions Ltd"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Location<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="jobLocation"
                required
                value={formData.jobLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                placeholder="e.g. Colombo"
              />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Job Type<span className="text-red-400">*</span>
              </label>
              <select
                name="jobType"
                required
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Salary Range
              </label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                placeholder="e.g. LKR30000-LKR50000"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Status<span className="text-red-400">*</span>
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">
              Job Description<span className="text-red-400">*</span>
            </label>
            <textarea
              name="jobDescription"
              required
              value={formData.jobDescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              placeholder="Describe the job role and requirements..."
            ></textarea>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2 p-6 bg-gray-750 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-blue-400 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                Responsibilities
              </label>
              <button
                type="button"
                onClick={() => addListItem('responsibilities')}
                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.responsibilities.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange(e, index, 'responsibilities')}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. Develop and maintain software applications"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(index, 'responsibilities')}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2 p-6 bg-gray-750 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-blue-400 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                Requirements
              </label>
              <button
                type="button"
                onClick={() => addListItem('requirements')}
                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange(e, index, 'requirements')}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. 5+ years of experience in software development"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(index, 'requirements')}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 p-6 bg-gray-750 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-blue-400 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                Benefits
              </label>
              <button
                type="button"
                onClick={() => addListItem('benefits')}
                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange(e, index, 'benefits')}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="e.g. Competitive salary and performance bonuses"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem(index, 'benefits')}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">
              Company Description
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              placeholder="Tell candidates about your company..."
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 font-medium text-lg"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
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