import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, CalendarDays, Filter, ArrowLeft, ArrowUp, ArrowDown, UserCircle, Mail, Phone, Briefcase, Calendar, Download, X } from "lucide-react";
import { motion } from "framer-motion";

// Sample candidate data
const candidateData = [
  {
    id: 1,
    jobId: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+94 76 123 4567",
    appliedDate: "March 15, 2025",
    experience: "6 years",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    education: "MSc in Computer Science",
    status: "Shortlisted",
    resumeUrl: "/resumes/john-smith.pdf"
  },
  {
    id: 2,
    jobId: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "+94 77 234 5678",
    appliedDate: "March 18, 2025",
    experience: "8 years",
    skills: ["React", "Angular", "JavaScript", "Azure", "PostgreSQL"],
    education: "BSc in Software Engineering",
    status: "New",
    resumeUrl: "/resumes/sarah-johnson.pdf"
  },
  {
    id: 3,
    jobId: 1,
    firstName: "Michael",
    lastName: "Wong",
    email: "michael.w@example.com",
    phone: "+94 75 345 6789",
    appliedDate: "March 10, 2025",
    experience: "4 years",
    skills: ["React", "Redux", "TypeScript", "GCP", "Firebase"],
    education: "BSc in Computer Engineering",
    status: "Interviewing",
    resumeUrl: "/resumes/michael-wong.pdf"
  },
  {
    id: 4,
    jobId: 2,
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.c@example.com",
    phone: "+94 71 456 7890",
    appliedDate: "March 17, 2025",
    experience: "3 years",
    skills: ["Java", "Spring", "Kubernetes", "Docker"],
    education: "BSc in Information Technology",
    status: "New",
    resumeUrl: "/resumes/emily-chen.pdf"
  }
];

// Sample job data
const jobData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Ltd",
    location: "Colombo"
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Digital Innovations Inc",
    location: "Kandy"
  }
];

function CandidateDetailsView() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(parseInt(jobId) || "all");

  // Status options for filtering
  const statusOptions = ["All", "New", "Shortlisted", "Interviewing", "Rejected"];

  // Initialize candidates based on job ID or show all
  useEffect(() => {
    let initialCandidates = candidateData;
    if (selectedJob !== "all") {
      initialCandidates = candidateData.filter(candidate => candidate.jobId === selectedJob);
    }
    setCandidates(initialCandidates);
    setFilteredCandidates(initialCandidates);
  }, [selectedJob]);

  // Filter and sort candidates
  useEffect(() => {
    let filtered = [...candidates];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(candidate => candidate.status === filterStatus);
    }
    
    // Sort candidates
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === "appliedDate") {
        const dateA = new Date(a.appliedDate);
        const dateB = new Date(b.appliedDate);
        comparison = dateA - dateB;
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, sortBy, sortOrder, filterStatus]);

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Handle job filter change
  const handleJobChange = (e) => {
    const jobId = e.target.value === "all" ? "all" : parseInt(e.target.value);
    setSelectedJob(jobId);
  };

  // Get job title for display
  const getJobTitle = (jobId) => {
    const job = jobData.find(j => j.id === jobId);
    return job ? job.title : "Unknown Position";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header section */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Candidate Applications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View and manage candidate applications for your job postings
            </p>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition duration-300"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedJob}
              onChange={handleJobChange}
              className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="all">All Jobs</option>
              {jobData.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            Showing {filteredCandidates.length} candidates
            {selectedJob !== "all" && ` for ${getJobTitle(selectedJob)}`}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>Last updated: March 20, 2025</span>
          </div>
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Candidate List */}
        <motion.div 
          className="lg:col-span-1 flex flex-col min-h-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">Candidates</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Filter size={14} />
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-md text-xs"
                  >
                    <option value="appliedDate">Date</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                  </select>
                  <button 
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="h-full"
              >
                {filteredCandidates.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No candidates match your search criteria
                  </div>
                ) : (
                  filteredCandidates.map(candidate => (
                    <motion.div 
                      key={candidate.id}
                      variants={itemVariants}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-white/40 dark:hover:bg-gray-700/40 transition duration-150 ${selectedCandidate?.id === candidate.id ? 'bg-purple-50/70 dark:bg-purple-900/30 border-l-4 border-l-purple-500' : ''}`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white mr-3 shadow-sm">
                            {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{candidate.firstName} {candidate.lastName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{candidate.email}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">ID: {candidate.id}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{candidate.phone}</span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {candidate.appliedDate}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Candidate Details */}
        <motion.div 
          className="lg:col-span-2 flex flex-col min-h-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {selectedCandidate ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Candidate Details</h2>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xl shadow-md">
                      {selectedCandidate.firstName.charAt(0)}{selectedCandidate.lastName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="mb-4 inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 text-sm">
                      Candidate ID: {selectedCandidate.id}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedCandidate.firstName} {selectedCandidate.lastName}</h3>
                    
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 gap-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                            <div className="flex items-center">
                              <Mail size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                              <a href={`mailto:${selectedCandidate.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                {selectedCandidate.email}
                              </a>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                            <div className="flex items-center">
                              <Phone size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                              <a href={`tel:${selectedCandidate.phone}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                {selectedCandidate.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Applied Date</p>
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{selectedCandidate.appliedDate}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resume/CV</p>
                            <div className="flex items-center">
                              <a
                                href={selectedCandidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 shadow-sm"
                              >
                                <Download size={16} className="mr-2" />
                                Download CV
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center justify-center h-full">
              <UserCircle size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No Candidate Selected</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">Select a candidate from the list to view their details.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default CandidateDetailsView;