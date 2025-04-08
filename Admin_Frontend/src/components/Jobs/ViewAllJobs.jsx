import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';

const ViewAllJobs = ({ jobs = defaultJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus; // Updated to 'status'
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Jobs</h1>
        <Link 
          to="/jobs/add"  // Fixed route to "/jobs/add"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Add New Job</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600 dark:text-gray-400" />
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{job.jobType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{job.postedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${job.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                        job.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                      {job.status}  {/* Updated to 'status' */}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/view-job/${job.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={18} />
                      </Link>
                      <Link to={`/jobs/edit/${job.id}`} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => {/* Delete handling */}} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No jobs found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Default job data
const defaultJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Solutions Ltd",
    location: "Colombo",
    jobType: "Full-time",
    salaryRange: "LKR30000-LKR 50000",
    status: "Active",  // Updated to 'status'
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
  },
  {
    id: 2,
    title: "Marketing Specialist",
    company: "Growth Brands",
    location: "Kandy",
    jobType: "Part-time",
    salaryRange: "LKR25000-LKR40000",
    status: "Active",  // Updated to 'status'
    postedDate: "March 10, 2025",
    description: "Join our marketing team to help develop and implement effective marketing strategies.",
    responsibilities: [],
    requirements: [],
    benefits: [],
    companyDescription: "Growth Brands specializes in helping small businesses scale through targeted marketing efforts."
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DataMetrics Solutions",
    location: "Colombo",
    jobType: "Full-time",
    salaryRange: "LKR35000-LKR55000",
    status: "Inactive",  // Updated to 'status'
    postedDate: "February 28, 2025",
    description: "Looking for a data analyst to help transform data into actionable insights.",
    responsibilities: [],
    requirements: [],
    benefits: [],
    companyDescription: "DataMetrics Solutions helps companies make better decisions through data-driven insights."
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Creative Solutions",
    location: "Galle",
    jobType: "Contract",
    salaryRange: "LKR45000-LKR65000",
    status: "Draft",  // Updated to 'status'
    postedDate: "March 15, 2025",
    description: "Design beautiful and functional user interfaces for web and mobile applications.",
    responsibilities: [],
    requirements: [],
    benefits: [],
    companyDescription: "Creative Solutions is an award-winning design studio focusing on creating exceptional user experiences."
  }
];

export default ViewAllJobs;
