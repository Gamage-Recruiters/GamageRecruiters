import { useParams } from "react-router-dom";
import { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, Calendar, ArrowLeft } from "lucide-react";

const jobData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Ltd",
    location: "Colombo",
    jobType: "Full-time",
    salaryRange: "$3000-$5000",
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
  // Add more job listings as needed
];

export default function JobDetails() {
  const { jobId } = useParams();
  const job = jobData.find((job) => job.id === parseInt(jobId));
  const [isApplying, setIsApplying] = useState(false);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-indigo-800 text-white py-12">
        <div className="mx-auto max-w-4xl  px-6 pt-10">
          <h1 className="text-4xl font-bold">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-y-3 gap-x-6 text-sm md:text-base">
            <div className="flex items-center">
              <Briefcase className="mr-2" size={18} />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" size={18} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={18} />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2" size={18} />
              <span>{job.salaryRange}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <span>Posted: {job.postedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About The Role</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-blue-600 h-6 w-1 rounded-full mr-3"></span>
              Key Responsibilities
            </h3>
            <ul className="mt-4 space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex">
                  <span className="bg-blue-100 text-blue-800 rounded-full flex items-center justify-center h-6 w-6 mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-green-600 h-6 w-1 rounded-full mr-3"></span>
              Requirements
            </h3>
            <ul className="mt-4 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex">
                  <span className="bg-green-100 text-green-800 rounded-full flex items-center justify-center h-6 w-6 mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-purple-600 h-6 w-1 rounded-full mr-3"></span>
              Benefits & Perks
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-gray-700">{benefit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About The Company</h2>
          <p className="text-gray-700 leading-relaxed">{job.companyDescription}</p>
        </div>

        {isApplying ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for this Position</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
                <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                  <p className="text-gray-500 mb-2">Drag and drop your resume here, or click to browse</p>
                  <button type="button" className="text-blue-600 hover:text-blue-800">Browse Files</button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsApplying(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              Apply for this Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
}