import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronRightIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import baseURL from '../config/axiosPortConfig';
import { useLocation } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import { motion } from 'framer-motion';

const salaryRanges = [
  "All Ranges",
  "Below LKR 20,000",
  "LKR 20,000 - LKR 50,000",
  "LKR 50,000 - LKR100,000",
  "LKR 100,000+"
];

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to calculate days ago
const daysAgo = (dateString) => {
  const postedDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

function JobListings() {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJobType, setSelectedJobType] = useState('All Types');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('All Ranges');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [showFilters, setShowFilters] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortOption, setSortOption] = useState('newest');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // For rotating text animation
  const phrases = ["Opportunities", "Careers", "Growth", "Success", "Dreams"];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const locations = ["All Locations", ...new Set(jobs.map(job => job.jobLocation || job.location).filter(location => location && location.trim() !== ''))];
  const jobTypes = ["All Types", ...new Set(jobs.map(job => job.jobType).filter(type => type && type.trim() !== ''))];
  
  // Debug logging for available data
  useEffect(() => {
    if (jobs.length > 0) {
      console.log('Available job data:', jobs.slice(0, 3)); // Log first 3 jobs
      console.log('Available locations:', locations);
      console.log('Available job types:', jobTypes);
      console.log('Available industries:', industries.map(i => i.name));
    }
  }, [jobs, locations, jobTypes]);
  
  // Sample industries for demonstration - you can replace with actual data
  const industries = [
    { name: "FMCG" },
    { name: "Other" },
    { name: "Information Technology" },
    { name: "Apparel" },
    { name: "Automotive" },
    { name: "Power & Energy" },
    { name: "Pharmaceutical" },
    { name: "Healthcare" },
    { name: "Hospitality" },
    { name: "E-Commerce" },
    { name: "Shipping & Freight" },
    { name: "Construction" }
  ];
  
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    loadJobs();
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFeaturedJobs(jobs.filter(job => job.featured));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const loadJobsResponse = await axios.get(`${baseURL}/api/jobs`);
      if (loadJobsResponse.status == 200) {
        // console.log(loadJobsResponse.data.jobs);
        setJobs(loadJobsResponse.data.jobs);
      } else {
        toast.error('Error Loading Jobs');
        console.log(loadJobsResponse.statusText);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, []);
  
  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    // Debug logging
    console.log('Filtering job:', {
      jobName: job.jobName,
      company: job.company,
      jobType: job.jobType,
      location: job.location || job.jobLocation,
      industry: job.industry,
      salaryRange: job.salaryRange
    });

    const matchesSearch = 
      (job.jobName && job.jobName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.jobDescription && job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(job.qualifications) && job.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesLocation = selectedLocation === 'All Locations' || 
      (job.location && job.location === selectedLocation) || 
      (job.jobLocation && job.jobLocation === selectedLocation);
    
    const matchesJobType = selectedJobType === 'All Types' || 
      (job.jobType && job.jobType === selectedJobType);
    
    // Map job types to industries if industry field doesn't exist
    const jobIndustry = job.industry || job.category || job.sector || 
      (job.jobType === 'Full-time' ? 'Other' : 
       job.jobType === 'Part-time' ? 'Other' : 
       job.jobType === 'Internship' ? 'Other' : 'Other');
    
    const matchesIndustry = selectedIndustry === 'All Industries' || jobIndustry === selectedIndustry;
    
    let matchesSalary = selectedSalaryRange === 'All Ranges';
    if (!matchesSalary && job.salaryRange) {
      try {
        const salaryValue = parseFloat(job.salaryRange.toString().replace(/[^\d.]/g, ''));
        
        if (!isNaN(salaryValue)) {
          if (selectedSalaryRange === 'Below LKR 20,000') {
            matchesSalary = salaryValue < 20000;
          } else if (selectedSalaryRange === 'LKR 20,000 - LKR 50,000') {
            matchesSalary = salaryValue >= 20000 && salaryValue <= 50000;
          } else if (selectedSalaryRange === 'LKR 50,000 - LKR100,000') {
            matchesSalary = salaryValue >= 50000 && salaryValue <= 100000;
          } else if (selectedSalaryRange === 'LKR 100,000+') {
            matchesSalary = salaryValue >= 100000;
          }
        }
      } catch (error) {
        console.log('Error parsing salary:', job.salaryRange, error);
        matchesSalary = true; // Skip salary filtering if there's an error
      }
    }

    const result = matchesSearch && matchesLocation && matchesJobType && matchesSalary && matchesIndustry;
    
    // Debug logging for filter results
    console.log('Filter results:', {
      matchesSearch,
      matchesLocation,
      matchesJobType,
      matchesSalary,
      matchesIndustry,
      finalResult: result
    });

    return result;
  });

  // Helper to parse salary range for sorting
  const parseSalary = (salaryRange) => {
    if (!salaryRange) return { min: 0, max: 0 };
    const clean = salaryRange.replace(/LKR|USD|\$|,|\s/gi, '');
    if (clean.includes('-')) {
      const [min, max] = clean.split('-').map(Number);
      return { min, max };
    } else if (clean.endsWith('+')) {
      const min = Number(clean.replace('+', ''));
      return { min, max: min };
    } else {
      const num = Number(clean);
      return { min: num, max: num };
    }
  };

  // Sort jobs before rendering
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aSalary = parseSalary(a.salaryRange);
    const bSalary = parseSalary(b.salaryRange);

    if (sortOption === 'newest') {
      return new Date(b.postedDate) - new Date(a.postedDate);
    } else if (sortOption === 'oldest') {
      return new Date(a.postedDate) - new Date(b.postedDate);
    } else if (sortOption === 'salary-high') {
      return bSalary.max - aSalary.max;
    } else if (sortOption === 'salary-low') {
      return aSalary.min - bSalary.min;
    }
    return 0;
  });

  // Always show the latest 10 jobs in the carousel, regardless of filters
  const latestJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    .slice(0, 10);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedJobType('All Types');
    setSelectedSalaryRange('All Ranges');
    setSelectedIndustry('All Industries');
  };
  
  // Debug logging for filter changes
  useEffect(() => {
    console.log('Filter values changed:', {
      searchTerm,
      selectedLocation,
      selectedJobType,
      selectedSalaryRange,
      selectedIndustry
    });
  }, [searchTerm, selectedLocation, selectedJobType, selectedSalaryRange, selectedIndustry]);

  // Function to render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count).fill().map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ));
  };

  // Enhanced JobCard component with animation
  const EnhancedJobCard = ({ job }) => {
    const navigate = useNavigate();
    const isNonPaid = job.salaryRange?.toLowerCase() === 'non paid';

    // Generate a subtle background color based on job type
    const getBackgroundColor = () => {
      switch (job.jobType) {
        case 'Full-time':
          return 'bg-gradient-to-br from-white via-blue-200 to-blue-300/80';
        case 'Part-time':
          return 'bg-gradient-to-br from-white via-blue-200 to-blue-300/80';
        case 'Internship':
          return 'bg-gradient-to-br from-white via-blue-200 to-blue-300/80';
        default:
          return 'bg-gradient-to-br from-white via-blue-200 to-blue-300/80';
      }
    };

    const viewJob = useCallback((id) => {
      if(id) {
        navigate(`/jobs/${id}`, { replace: true });
      }
    }, [navigate]);

    return (
      <div className={`group ${getBackgroundColor()} shadow-xl rounded-xl p-6 hover:shadow-2xl hover:shadow-blue-300/70 hover:scale-[1.02] transition-all duration-300 border border-blue-300 hover:border-blue-500 cursor-pointer`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-400 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-6 h-6 text-blue-800 group-hover:text-blue-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors duration-300">{job.jobName || job.title}</h3>
              <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors duration-300">{job.company}</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium group-hover:scale-105 transition-all duration-300 ${
            job.jobType === 'Full-time' 
              ? 'bg-blue-300 text-blue-900 group-hover:bg-blue-400 shadow-lg' 
              : job.jobType === 'Part-time' 
                ? 'bg-blue-300 text-blue-900 group-hover:bg-blue-400 shadow-lg'
                : job.jobType === 'Internship'
                  ? 'bg-blue-300 text-blue-900 group-hover:bg-blue-400 shadow-lg'
                  : 'bg-blue-300 text-blue-900 group-hover:bg-blue-400 shadow-lg'
          }`}>
            {job.jobType}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{job.description || job.jobDescription}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg px-3 py-2.5 group-hover:bg-blue-300 group-hover:shadow-lg transition-all duration-300 border border-blue-300 group-hover:border-blue-400">
            <svg className="w-4 h-4 mr-2 text-blue-700 group-hover:text-blue-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium group-hover:text-blue-900 transition-colors duration-300">{job.jobLocation || job.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg px-3 py-2.5 group-hover:bg-blue-300 group-hover:shadow-lg transition-all duration-300 border border-blue-300 group-hover:border-blue-400">
            <svg className={`w-4 h-4 mr-2 ${isNonPaid ? 'text-gray-400' : 'text-blue-700'} group-hover:${isNonPaid ? 'text-gray-500' : 'text-blue-800'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className={`${isNonPaid ? 'text-gray-500' : 'text-gray-700 font-medium'} group-hover:${isNonPaid ? 'text-gray-600' : 'text-blue-700'} transition-colors duration-300`}>
              {job.salaryRange}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={() => viewJob(job.jobId || job.id)}
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-2xl hover:from-blue-800 hover:to-blue-900 hover:shadow-3xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            View Details
            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const visibleCount = 3; // Always show 3 jobs

  // Auto-scroll effect
  useEffect(() => {
    if (!latestJobs.length) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev =>
        prev + 1 > latestJobs.length - 3 ? 0 : prev + 1
      );
    }, 3000);
    carouselRef.current = interval;
    return () => clearInterval(interval);
  }, [latestJobs.length]);

  // Manual navigation
  const handlePrev = () => {
    setCarouselIndex(prev =>
      prev - 1 < 0 ? Math.max(latestJobs.length - 3, 0) : prev - 1
    );
  };
  const handleNext = () => {
    setCarouselIndex(prev =>
      prev + 1 > latestJobs.length - 3 ? 0 : prev + 1
    );
  };

  // Pause auto-scroll on hover
  const pauseAutoScroll = () => {
    if (carouselRef.current) clearInterval(carouselRef.current);
  };
  const resumeAutoScroll = () => {
    // handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <ToastContainer position="top-center" />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-400 bg-opacity-30 text-blue-200 text-sm font-medium">
                Job Opportunities
              </span>
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-2">
              Find Your Dream <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Career</span>
            </h1>
            
            <div className="h-16 overflow-hidden relative mb-8">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: currentPhrase * -64 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                {phrases.map((phrase, index) => (
                  <h2 key={phrase} className="text-2xl md:text-3xl font-bold h-16 flex items-center justify-center text-blue-200">
                    Discover {phrase}
                  </h2>
                ))}
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto"
            >
              Discover exceptional opportunities with leading companies in Sri Lanka. Your next career move is just a click away.
            </motion.p>
          </motion.div>
          
          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="relative rounded-xl shadow-2xl">
              <input
                type="text"
                className="w-full rounded-xl border-0 py-4 pl-5 pr-12 text-gray-900 ring-2 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 text-lg"
                placeholder="Search by job title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content container */}
      <main className="py-12 pb-0">
        {/* Alert Card Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
          <AlertCard />
        </div>

        {/* About Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 rounded-2xl shadow-xl p-10 text-center border border-blue-100">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Empowering Careers, Connecting Talent</h2>
            <div className="prose prose-lg text-gray-700 mx-auto space-y-4">
              <p>
                Since 2019, Gamage Recruiters has been a driving force in Sri Lanka's recruitment industry, bridging the gap between skilled professionals and leading organizations across diverse sectors. With a deep understanding of the evolving job market and a commitment to excellence, we have earned a trusted reputation for matching the right talent with the right opportunities.
              </p>
              <p>
                We don't just help you find a job — we help you shape your career. Whether you're a fresh graduate looking for your first step, a professional seeking career advancement, or someone transitioning into a new field, our experienced recruitment team is here to guide you every step of the way. From resume building and interview preparation to onboarding and post-placement support, we provide comprehensive services designed to ensure your long-term success.
              </p>
              <p>
                With a strong presence in emerging markets and an extensive network of employers, we are proud to support equal opportunity, diversity, and inclusive hiring practices. Our proven track record, rapid placement process, and tailored solutions make us the go-to recruitment partner for thousands of job seekers and hundreds of companies. Join the Gamage Recruiters community today and discover opportunities that align with your goals, passions, and potential. Let us help you take the next step in your professional journey — with confidence and purpose.
              </p>  
            </div>
          </div>
        </section>

        {/* Featured jobs section */}
        {featuredJobs.length > 0 && !isLoading && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-gradient-to-br from-white to-blue-50/30 py-8 px-6 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredJobs.map(job => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block">
                    <EnhancedJobCard job={job} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Job listings section with sidebar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Industry Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Industry</h3>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <button
                        key={industry.name}
                        onClick={() => setSelectedIndustry(industry.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedIndustry === industry.name
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                      >
                        {industry.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Type</h3>
                  <div className="space-y-3">
                    {jobTypes.slice(1).map((type) => (
                      <label key={type} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={selectedJobType === type}
                          onChange={(e) => setSelectedJobType(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                          selectedJobType === type
                            ? 'border-blue-500 bg-blue-500 shadow-sm'
                            : 'border-gray-300 group-hover:border-blue-400 group-hover:shadow-sm'
                        }`}>
                          {selectedJobType === type && (
                            <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                          )}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-200 ${
                          selectedJobType === type ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="input-no-arrow w-full rounded-xl border-2 border-gray-200 py-3 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer transition-all duration-200"
                      style={{ 
                        WebkitAppearance: 'none', 
                        MozAppearance: 'none',
                        backgroundImage: 'none',
                        background: 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.7em top 50%',
                        backgroundSize: '0.65em auto'
                      }}
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Salary Range Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Range</h3>
                  <div className="relative">
                    <select
                      value={selectedSalaryRange}
                      onChange={(e) => setSelectedSalaryRange(e.target.value)}
                      className="input-no-arrow w-full rounded-xl border-2 border-gray-200 py-3 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer transition-all duration-200"
                      style={{ 
                        WebkitAppearance: 'none', 
                        MozAppearance: 'none',
                        backgroundImage: 'none',
                        background: 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.7em top 50%',
                        backgroundSize: '0.65em auto'
                      }}
                    >
                      {salaryRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>


                {/* Sort Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h3>
                  <div className="relative">
                    <select
                      className="input-no-arrow w-full rounded-xl border-2 border-gray-200 py-3 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white appearance-none cursor-pointer transition-all duration-200"
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                      style={{ 
                        WebkitAppearance: 'none', 
                        MozAppearance: 'none',
                        backgroundImage: 'none',
                        background: 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.7em top 50%',
                        backgroundSize: '0.65em auto'
                      }}
                    >
                      <option value="newest" className='cursor-pointer'>Newest First</option>
                      <option value="oldest" className='cursor-pointer'>Oldest First</option>
                      <option value="salary-high" className='cursor-pointer'>Highest Salary</option>
                      <option value="salary-low" className='cursor-pointer'>Lowest Salary</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Right Content - Job Listings */}
            <div className="flex-1">
              <div className="space-y-6">
                {/* Results count */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-left">
                      <p className="text-lg font-medium text-gray-700">
                        {isLoading ? 'Loading jobs...' : `Showing ${sortedJobs.length} ${sortedJobs.length === 1 ? 'job' : 'jobs'}`}
                      </p>
                      {!isLoading && (
                        <p className="text-sm text-gray-500">
                          Total jobs: {jobs.length} | Filtered: {filteredJobs.length}
                        </p>
                      )}
                    </div>
                    
                    {/* Mobile filter toggle */}
                    <button
                      className="lg:hidden flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FunnelIcon className="h-5 w-5" />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                  </div>
                </div>

                {/* Job listings */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {renderSkeletons(6)}
                  </div>
                ) : (
                  <>
                    {sortedJobs.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No matching jobs found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                        <button 
                          onClick={clearFilters}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedJobs.map((job) => (
                          <EnhancedJobCard job={job} key={job.jobId}/>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && !isLoading && (
                  <div className="mt-12 flex items-center justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="relative z-10 inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        2
                      </button>
                      <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                        3
                      </button>
                      <button className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter subscription */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-16 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-3">Never Miss a Job Opportunity</h2>
                <p className="text-xl text-blue-100">Get personalized job alerts delivered straight to your inbox</p>
              </div>
              <div >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow rounded-xl border-0 py-3 px-5 text-gray-900 shadow-lg ring-2 ring-inset ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 text-lg"
                  />
                  <button 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                    onClick={() => {
                      if (!newsletterEmail) {
                        toast.error('Please enter your email');
                      } else {
                        toast.success('Successfully Subscribed!');
                        setNewsletterEmail('');
                      }
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default memo(JobListings);