import React, { useState, useEffect } from 'react';
import { Download, ArrowDown, ArrowRight, Briefcase, FileText, User, Mail, Phone, X } from 'lucide-react';

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/jobs/statistics');
        const data = await response.json();
        
        if (response.ok) {
          console.log(data);
          console.log(response);
          if (Array.isArray(data.data) && data.data.length > 0) {
            setSelectedJob(data.data[0].jobId);
            setApplications(data.data);
            setJobs(data.data);
            setSelectedJob(null);
            console.log("Jobsetdone");
            console.log("Array data", data);
          } else {
            setSelectedJob(null);
            setApplications([]);
            
            setJobs([]);
            console.log("NUll Job set");
            console.log("Array data", data);
          }
        } else {
          setError(data.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        console.error(err);
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
      setApplications([]);
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
        setApplications([]);
      }
    } catch (err) {
      setError('Failed to fetch applications');
      setApplications([]);
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
    showDownloadNotification('All CVs download started');
  };

  const handleDownloadCV = (applicationId, name) => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/jobapplications/download/${applicationId}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showDownloadNotification(`${name}'s CV download started`);
  };

  const showDownloadNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-purple-600 to-blue-500',
      'from-blue-600 to-cyan-500',
      'from-emerald-600 to-teal-500',
      'from-indigo-600 to-purple-500',
      'from-pink-600 to-rose-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gray-800 py-6 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Briefcase className="mr-3 text-teal-400" size={28} />
              Talent Hub
            </h1>
            <p className="text-gray-400 mt-1">Job Applications Dashboard</p>
          </div>
          <div className="bg-gray-700 px-4 py-2 rounded-lg text-teal-400 font-medium">
            {jobs.length} Active Positions
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
            <X className="text-red-400 mr-2 mt-0.5" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Notification toast */}
        {showNotification && (
          <div className="fixed bottom-6 right-6 bg-gray-800 border-l-4 border-teal-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in-up">
            <div className="flex items-center">
              <Download className="mr-3 text-teal-400" size={20} />
              <span>{notificationMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {jobs.map((job) => {
            const gradientClass = getRandomGradient();
            return (
            <div key={job.jobId} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
              <div
                className="p-5 cursor-pointer transition-colors"
                onClick={() => handleJobClick(job.jobId)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center mr-4 shadow-lg`}>
                      <Briefcase className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{job.jobName}</h2>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-700/60 rounded-full px-4 py-1 text-sm">
                      <span className="text-teal-400 font-semibold">{job.applicationCount}</span>
                      <span className="text-gray-400 ml-1">application{job.applicationCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-gray-400 transition-transform duration-300">
                      {selectedJob === job.jobId ? 
                        <ArrowDown size={20} className="text-teal-400" /> : 
                        <ArrowRight size={20} />
                      }
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob === job.jobId && (
                <div className="border-t border-gray-700 bg-gray-800/50 p-5">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <FileText className="mr-2 text-teal-400" size={18} />
                      Applications
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAll(job.jobId);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download All CVs
                    </button>
                  </div>

                  {appLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
                      <p className="text-gray-400 mt-3">Loading applications...</p>
                    </div>
                 ) : selectedJob === job.jobId && Array.isArray(applications) && applications.length === 0 ? (


                    <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-8 text-center">
                      <div className="bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-gray-500" size={24} />
                      </div>
                      <p className="text-gray-400">No applications found for this position</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applications.map((app) => (
                        <div
                          key={app.applicationId}
                          className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow hover:border-gray-600"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center text-teal-400">
                                <User size={20} />
                              </div>
                              <div>
                                <p className="font-medium text-white text-lg">
                                  {app.firstName} {app.lastName}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-gray-400 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-500" />{app.email}
                                  </p>
                                  <p className="text-sm text-gray-400 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />{app.phoneNumber}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadCV(app.applicationId, `${app.firstName} ${app.lastName}`);
                              }}
                              className="bg-gray-700 hover:bg-gray-600 text-teal-400 hover:text-teal-300 px-3 py-2 rounded-lg flex items-center text-sm transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              CV
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )})}
        </div>
      </main>
    </div>
  );
};

export default JobDashboard;