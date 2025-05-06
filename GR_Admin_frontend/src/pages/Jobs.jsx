import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Edit2, Trash2, MapPin, Clock, DollarSign, 
  Briefcase, Calendar, PlusCircle, Filter, ChevronDown, Loader,
  Star, Moon, Sun, Zap, TrendingUp, Coffee
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
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  // Handle job editing
  const handleEditJob = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Job type icon mapping
  const getJobTypeIcon = (jobType) => {
    if (!jobType) return <Briefcase />;
    
    const type = jobType.toLowerCase();
    if (type.includes('full')) return <Coffee />;
    if (type.includes('part')) return <Clock />;
    if (type.includes('contract')) return <Zap />;
    if (type.includes('freelance')) return <TrendingUp />;
    return <Briefcase />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${
              isDarkMode ? 'from-purple-400 to-pink-400' : 'from-indigo-600 to-purple-600'
            } bg-clip-text text-transparent flex items-center`}>
              <Briefcase className="mr-3 h-8 w-8" />
              Job Management
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/jobs/add")}
              className={`flex items-center px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              }`}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Post New Job
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-100'
        } rounded-2xl shadow-xl p-6 mb-8 transition-colors`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              } h-5 w-5`} />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 w-full rounded-xl focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                    : 'border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
                } shadow-sm transition-colors`}
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center justify-between w-full md:w-48 px-4 py-3 rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600 hover:border-purple-500 text-gray-200'
                    : 'border border-gray-200 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center">
                  <Filter className={`h-5 w-5 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span>Filters</span>
                </div>
                <ChevronDown className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {filterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg z-10 p-4 ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Job Type
                    </label>
                    <select 
                      value={filters.jobType}
                      onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                      className={`w-full rounded-lg p-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200'
                          : 'border border-gray-200'
                      }`}
                    >
                      <option value="">All Types</option>
                      {uniqueJobTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-2">
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Location
                    </label>
                    <select 
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className={`w-full rounded-lg p-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200'
                          : 'border border-gray-200'
                      }`}
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setFilters({ jobType: '', location: '' })}
                    className={`w-full mt-3 text-sm ${
                      isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
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
            <Loader className={`h-8 w-8 ${
              isDarkMode ? 'text-purple-400' : 'text-indigo-600'
            } animate-spin`} />
            <span className={`ml-3 text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Loading jobs...</span>
          </div>
        ) : error ? (
          <div className={`px-4 py-3 rounded-lg ${
            isDarkMode 
              ? 'bg-red-900 border border-red-800 text-red-300' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
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
                  className={`overflow-hidden rounded-2xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:border-purple-500'
                      : 'bg-white border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  <div className={`border-l-4 p-6 ${
                    isDarkMode 
                      ? isNewJob(job.postedDate) ? 'border-pink-500' : 'border-purple-500'
                      : 'border-indigo-500'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold line-clamp-2 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>{job.jobName || 'Untitled Job'}</h3>
                        <p className={`font-medium mt-1 ${
                          isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                        }`}>{job.company || 'Unknown Company'}</p>
                      </div>
                      <span className={`ml-3 px-3 py-1 text-xs font-bold rounded-full ${
                        isDarkMode 
                          ? isNewJob(job.postedDate)
                            ? 'bg-emerald-900 text-emerald-300'
                            : 'bg-amber-900 text-amber-300'
                          : isNewJob(job.postedDate) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isNewJob(job.postedDate) 
                          ? 'New' 
                          : 'Active'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <MapPin className={`h-4 w-4 mr-2 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        {job.jobLocation || 'Remote'}
                      </div>
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {getJobTypeIcon(job.jobType)}
                        <span className="ml-2">{job.jobType || 'Full-time'}</span>
                      </div>
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <DollarSign className={`h-4 w-4 mr-2 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        {job.salaryRange || 'Competitive'}
                      </div>
                      <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Calendar className={`h-4 w-4 mr-2 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        Posted on {formatDate(job.postedDate)}
                      </div>
                    </div>

                    <div className={`mt-6 pt-4 flex justify-between items-center ${
                      isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-100'
                    }`}>
                      <button className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-purple-300'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                      }`}>
                        <Briefcase className="h-4 w-4 inline mr-1" />
                        View Details
                      </button>
                      
                      <div className="flex space-x-1">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditJob(job.jobId)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          <Edit2 className="h-5 w-5" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteJob(job.jobId)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-pink-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
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
                    className={`rounded-2xl p-10 max-w-lg mx-auto ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <Briefcase className={`h-16 w-16 mx-auto mb-4 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-xl font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>No jobs found</h3>
                    <p className={`mb-6 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No jobs match your current search criteria. Try adjusting your filters or search term.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({ jobType: '', location: '' });
                      }}
                      className={`px-5 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      Clear Search
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

export default Jobs;