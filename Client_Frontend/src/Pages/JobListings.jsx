import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronRightIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import JobCard from '../components/JobCard';
import baseURL from '../config/axiosPortConfig';
import { useLocation } from 'react-router-dom';
import AlertCard from '../components/AlertCard';

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
  const [showFilters, setShowFilters] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [displayMode, setDisplayMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const [searchTerm, setSearchTerm] = useState('initialSearch');
  const [sortOption, setSortOption] = useState('newest');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  const locations = ["All Locations", ...new Set(jobs.map(job => job.jobLocation).filter(location => location && location.trim() !== ''))];
  const jobTypes = ["All Types", ...new Set(jobs.map(job => job.jobType).filter(type => type && type.trim() !== ''))];
  
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
      if(loadJobsResponse.status == 200) {
        setJobs(loadJobsResponse.data.jobs);
      } else {
        toast.error('Error Loading Jobs');
        console.log(loadJobsResponse.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }, [jobs]);
  
  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())||
      (Array.isArray(job.qualifications) && job.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation || job.jobLocation === selectedLocation;
    const matchesJobType = selectedJobType === 'All Types' || job.jobType === selectedJobType;
    
    let matchesSalary = selectedSalaryRange === 'All Ranges';
    if (!matchesSalary) {
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
    }

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedJobType('All Types');
    setSelectedSalaryRange('All Ranges');
  };

  // Function to render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count).fill().map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
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

    const viewJob = useCallback((id) => {
      if(id) {
        navigate(`/jobs/${id}`, { replace: true });
      }
    }, [navigate]);

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 relative group">
        {job.featured && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Featured
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 cursor-pointer" onClick={() => viewJob(job.jobId)}>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">{job.jobName}</h3>
            <p className="text-sm font-medium text-gray-600">{job.company}</p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {job.jobLocation}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {job.jobType}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                {job.salaryRange}
              </span>
            </div>
            
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">{job.description}</p>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                Posted {daysAgo(job.postedDate)} days ago
              </span>
              <span className="text-sm font-medium text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                View Details <ChevronRightIcon className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Your Dream Career
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Discover exceptional opportunities with leading companies in Sri Lanka. Your next career move is just a click away.
            </p>
          </div>
          
          {/* Search box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative rounded-lg shadow-lg">
              <input
                type="text"
                className="w-full rounded-lg border-0 py-4 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 text-lg"
                placeholder="Search by job title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <main className="space-y-16 py-12">
        {/* Alert Card Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AlertCard />
        </div>

        {/* About Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-8">Empowering Careers, Connecting Talent</h2>
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
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white py-8 px-6 rounded-xl shadow-sm">
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

        {/* Job listings section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {jobs.length === 0 && !isLoading ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs available</h3>
                <p className="text-gray-500 mb-6">There are currently no job listings. Please check back later.</p>
              </div>
            ) : (
              <>
                {/* Filters section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Filter Results</h2>
                    
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 md:hidden"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <FunnelIcon className="h-5 w-5" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          className={`p-2 rounded-lg ${displayMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-600'}`}
                          onClick={() => setDisplayMode('grid')}
                          title="Grid View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          className={`p-2 rounded-lg ${displayMode === 'list' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-600'}`}
                          onClick={() => setDisplayMode('list')}
                          title="List View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 text-sm"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>

                    <select
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                      className="rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 text-sm"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>

                    <select
                      value={selectedSalaryRange}
                      onChange={(e) => setSelectedSalaryRange(e.target.value)}
                      className="rounded-lg border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 text-sm"
                    >
                      {salaryRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Results count and sorting */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    {isLoading ? 'Loading jobs...' : `Showing ${sortedJobs.length} ${sortedJobs.length === 1 ? 'job' : 'jobs'}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      className="text-sm border-0 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 rounded-lg bg-gray-100 cursor-pointer"
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                    >
                      <option value="newest" className='cursor-pointer'>Newest First</option>
                      <option value="oldest" className='cursor-pointer'>Oldest First</option>
                      <option value="salary-high" className='cursor-pointer'>Highest Salary</option>
                      <option value="salary-low" className='cursor-pointer'>Lowest Salary</option>
                    </select>
                  </div>
                </div>

                {/* Job listings */}
                {isLoading ? (
                  <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {renderSkeletons(6)}
                  </div>
                ) : (
                  <>
                    <div className={`grid ${displayMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                      {sortedJobs.map((job) => (
                        <EnhancedJobCard job={job} key={job.jobId}/>
                      ))}
                    </div>

                    {sortedJobs.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No matching jobs found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                        <button 
                          onClick={clearFilters}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && !isLoading && (
                  <div className="mt-12 flex items-center justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        2
                      </button>
                      <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                        3
                      </button>
                      <button className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter subscription */}
        <section className="bg-gradient-to-r from-blue-900 to-black py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-3">Never Miss a Job Opportunity</h2>
                <p className="text-xl text-gray-300">Get personalized job alerts delivered straight to your inbox</p>
              </div>
              <div >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow rounded-lg border-0 py-3 px-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 text-lg"
                  />
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
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