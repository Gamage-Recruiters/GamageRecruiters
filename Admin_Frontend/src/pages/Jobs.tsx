import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Edit2, Trash2, MapPin, Clock, DollarSign, 
  Briefcase, Calendar, PlusCircle, Filter, ChevronDown, Loader 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    location: ''
  });

  // Fetch jobs data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        
        // Ensure data is an array
        const jobsArray = Array.isArray(data) ? data : data.jobs || [];
        setJobs(jobsArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
        // Set jobs to empty array in case of error
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters and search
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    const matchesSearch = 
      (job.jobName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesJobType = filters.jobType ? job.jobType === filters.jobType : true;
    const matchesLocation = filters.location ? 
      (job.jobLocation || '').includes(filters.location) : true;
    
    return matchesSearch && matchesJobType && matchesLocation;
  }) : [];

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get unique locations for filter
  const uniqueLocations = Array.isArray(jobs) ? 
    [...new Set(jobs.map(job => job.jobLocation).filter(Boolean))] : [];
  
  // Get unique job types for filter
  const uniqueJobTypes = Array.isArray(jobs) ? 
    [...new Set(jobs.map(job => job.jobType).filter(Boolean))] : [];

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete job');
        }
        
        setJobs(jobs.filter(job => job.jobId !== jobId));
      } catch (err) {
        console.error('Error deleting job:', err);
        setError(err.message);
      }
    }
  };

  // Check if a date is within the last 7 days
  const isNewJob = (dateString) => {
    if (!dateString) return false;
    try {
      const jobDate = new Date(dateString);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return jobDate > oneWeekAgo;
    } catch (e) {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Job Management
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/jobs/add")}
          className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Post New Job
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-between w-full md:w-48 px-4 py-3 border border-gray-200 rounded-xl hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {filterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-10 p-4"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select 
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  >
                    <option value="">All Types</option>
                    {uniqueJobTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg p-2"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={() => setFilters({ jobType: '', location: '' })}
                  className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-lg text-gray-600">Loading jobs...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}. Please try again later.
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <motion.div
                key={job.jobId || Math.random()}
                layoutId={`job-${job.jobId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="border-l-4 border-indigo-500 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{job.jobName || 'Untitled Job'}</h3>
                      <p className="text-indigo-600 font-medium mt-1">{job.company || 'Unknown Company'}</p>
                    </div>
                    <span className={`ml-3 px-3 py-1 text-xs font-bold rounded-full ${
                      isNewJob(job.postedDate) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isNewJob(job.postedDate) 
                        ? 'New' 
                        : 'Active'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {job.jobLocation || 'Remote'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {job.jobType || 'Full-time'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      {job.salaryRange || 'Competitive'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Posted on {formatDate(job.postedDate)}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors">
                      <Briefcase className="h-4 w-4 inline mr-1" />
                      View Details
                    </button>
                    
                    <div className="flex space-x-1">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteJob(job.jobId)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-2xl p-10 max-w-lg mx-auto"
                >
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">
                    No jobs match your current search criteria. Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ jobType: '', location: '' });
                    }}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Clear Search
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default Jobs;