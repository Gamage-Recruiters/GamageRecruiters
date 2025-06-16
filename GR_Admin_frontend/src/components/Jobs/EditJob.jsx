import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Plus, Minus, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import baseURL from '../../config/baseUrlConfig';

const EditJob = ({ onUpdateJob }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    jobId: 0,
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
    companyDescription: '',
    postedDate: ''
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/jobs/${jobId}`);
    
        if (response.data && response.data.data) {
          const job = response.data.data;
          console.log(response);
    
        const parseField = (field) => {
          try {
            return typeof field === 'string' ? JSON.parse(field) : Array.isArray(field) ? field : [''];
          } catch {
            return [field || ''];
          }
        };

        const responsibilities = parseField(job.responsibilities);
        const requirements = parseField(job.requirements);
        const benefits = parseField(job.benefits);
          
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
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job data');
        setLoading(false);
      }
    };
    
    
    if (jobId) {
      fetchJobData();
    } else {
      setError('Job ID is required');
      setLoading(false);
    }
  }, [jobId]);

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
        [field]: updatedList.length > 0 ? updatedList : ['']
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const cleanedFormData = {
        ...formData,
        responsibilities: formData.responsibilities.filter(item => item.trim() !== '').join('\n'),
        requirements: formData.requirements.filter(item => item.trim() !== '').join('\n'),
        benefits: formData.benefits.filter(item => item.trim() !== '').join('\n'),
      };
      
      
      await axios.put(`${baseURL}/api/jobs/update/${jobId}`, cleanedFormData, {
        withCredentials: true
      });
      
      if (onUpdateJob) {
        onUpdateJob(cleanedFormData);
      }
      
      navigate('/jobs');
    } catch (err) {
      console.error('Error updating job:', err);
      alert('Failed to update job. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{error}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The job you're looking for could not be found.</p>
        <button 
          onClick={() => navigate('/jobs')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobName"
              required
              value={formData.jobName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobLocation"
              required
              value={formData.jobLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Salary Range<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salaryRange"
              required
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="jobDescription"
            required
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Responsibilities<span className="text-red-500">*</span>
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Requirements<span className="text-red-500">*</span>
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="companyDescription"
            required
            value={formData.companyDescription}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default EditJob;