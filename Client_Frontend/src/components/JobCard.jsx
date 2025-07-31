export default function JobCard({ job }) {
  const isNonPaid = job.salaryRange?.toLowerCase() === 'non paid';

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          job.jobType === 'Full-time' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : job.jobType === 'Part-time' 
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : job.jobType === 'Internship'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {job.jobType}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className={`h-4 w-4 mr-1.5 ${isNonPaid ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={isNonPaid ? 'text-gray-500' : ''}>
              {job.salaryRange}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => window.location.href = `/jobs/${job.id}`}
          className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          View Details
        </button>
      </div>
    </div>
  );
}