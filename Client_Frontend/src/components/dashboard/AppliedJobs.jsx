import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const AppliedJobs = () => {
  // Sample data for applied jobs
  const [appliedJobs, setAppliedJobs] = useState([
    {
      id: "j001",
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "Colombo",
      appliedDate: "2025-02-28",
      status: "Interview Scheduled",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "j002",
      title: "Full Stack Engineer",
      company: "DataSys International",
      location: "Remote",
      appliedDate: "2025-02-15",
      status: "Application Viewed",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "j003",
      title: "UX/UI Designer",
      company: "Creative Minds",
      location: "Kandy",
      appliedDate: "2025-01-30",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-800",
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Applied Jobs</h2>
        <span className="text-sm text-gray-500">
          Showing {appliedJobs.length} applications
        </span>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {appliedJobs.map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Job Details */}
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600">
                  {job.company} • {job.location}
                </p>
                <p className="text-gray-500 text-sm">
                  Applied: {job.appliedDate}
                </p>
              </div>

              {/* Job Status & Details Link */}
              <div className="flex gap-3 items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.statusColor}`}>
                  {job.status}
                </span>
                <Link
                  to={`/applications/${job.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse More Jobs */}
      <div className="mt-6 text-center">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Briefcase size={18} />
          Browse More Jobs
        </Link>
      </div>
    </div>
  );
};

export default AppliedJobs;
