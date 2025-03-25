import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Plus, Minus, AlertTriangle } from 'lucide-react';

const EditJob = ({ jobs = defaultJobs, onUpdateJob }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salaryRange: '',
    Status: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    benefits: [''],
    companyDescription: '',
    postedDate: ''
  });

  useEffect(() => {
    // Find the job with the matching id
    const jobId = parseInt(id);
    const job = jobs.find(job => job.id === jobId);
    
    if (job) {
      // Ensure arrays have at least one item
      const responsibilities = job.responsibilities?.length > 0 ? job.responsibilities : [''];
      const requirements = job.requirements?.length > 0 ? job.requirements : [''];
      const benefits = job.benefits?.length > 0 ? job.benefits : [''];
      
      setFormData({
        ...job,
        responsibilities,
        requirements,
        benefits
      });
      setLoading(false);
    } else {
      setError('Job not found');
      setLoading(false);
    }
  }, [id, jobs]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create updated job object
    const updatedJob = {
      ...formData,
      // Filter out empty list items
      responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
      requirements: formData.requirements.filter(item => item.trim() !== ''),
      benefits: formData.benefits.filter(item => item.trim() !== ''),
    };
    
    // Call the onUpdateJob function if it exists
    if (onUpdateJob) {
      onUpdateJob(updatedJob);
    }
    
    // Redirect back
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-64 text-center">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{error}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">The job you're looking for could not be found.</p>
      <button 
        onClick={() => navigate('/jobs')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Back to Jobs
      </button>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Job</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={18} />
            <span>Update Job</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Type<span className="text-red-500">*</span>
            </label>
            <select
              name="jobType"
              required
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Salary Range
            </label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              name="Status"
              required
              value={formData.Status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Posted Date - Read only */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Posted Date
          </label>
          <input
            type="text"
            readOnly
            value={formData.postedDate}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>

        {/* Responsibilities */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Responsibilities
            </label>
            <button
              type="button"
              onClick={() => addListItem('responsibilities')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.responsibilities.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(e, index, 'responsibilities')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'responsibilities')}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Requirements
            </label>
            <button
              type="button"
              onClick={() => addListItem('requirements')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(e, index, 'requirements')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'requirements')}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Benefits
            </label>
            <button
              type="button"
              onClick={() => addListItem('benefits')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(e, index, 'benefits')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'benefits')}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Description
          </label>
          <textarea
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

// Default job data for testing
const defaultJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Solutions Ltd",
    location: "Colombo",
    jobType: "Full-time",
    salaryRange: "LKR30000-LKR 50000",
    Status: "Active", 
    postedDate: "March 5, 2025",
    description:
      "Looking for an experienced software engineer to lead our development team. Join our innovative company to create cutting-edge solutions that transform the way businesses operate in the digital space.",
    responsibilities: [
      "Develop and maintain software applications",
      "Lead a team of junior developers",
      "Ensure best coding practices are followed",
      "Collaborate with product managers to define feature requirements",
      "Participate in code reviews and architectural decisions"
    ],
    requirements: [
      "5+ years of experience in software development",
      "Proficiency in React, Node.js, and TypeScript",
      "Strong problem-solving skills",
      "Experience with cloud platforms (AWS/Azure/GCP)",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Flexible work arrangements",
      "Health insurance and wellness programs",
      "Professional development opportunities",
      "Modern office with great facilities"
    ],
    companyDescription: "Tech Solutions Ltd is a leading software development company specializing in enterprise solutions. With over 10 years in the industry, we've helped hundreds of businesses transform their digital presence."
  }
];

export default EditJob;