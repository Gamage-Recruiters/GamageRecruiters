import React, { useState, useEffect } from 'react';

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/jobapplications/applications');
        const data = await response.json();
        if (response.ok) {
          setJobs(data.data);
        } else {
          setError(data.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = async (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null);
      return;
    }
    
    try {
      setAppLoading(true);
      setError('');
      const response = await fetch(`http://localhost:8000/api/jobapplications/${jobId}/applications`);
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.data);
        setSelectedJob(jobId);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setAppLoading(false);
    }
  };

  const handleDownloadAll = (jobId) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/jobapplications/${jobId}/applications/download-all`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCV = (applicationId) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/jobapplications/download/${applicationId}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Applications Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.jobId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => handleJobClick(job.jobId)}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{job.jobName}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.applicationCount} application{job.applicationCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-gray-500 transform transition-transform">
                {selectedJob === job.jobId ? '▼' : '▶'}
              </span>
            </div>

            {selectedJob === job.jobId && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Applications</h3>
                  <button
                    onClick={() => handleDownloadAll(job.jobId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download All CVs
                  </button>
                </div>

                {appLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No applications found</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.applicationId}
                        className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-600">{app.phoneNumber}</p>
                        </div>
                        <button
                          onClick={() => handleDownloadCV(app.applicationId)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download CV
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobDashboard;