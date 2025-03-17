import { useState } from "react";


export default function Application() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: "Software Engineer",
      company: "Tech Solutions Ltd",
      status: "Pending",
    },
    {
      id: 2,
      jobTitle: "Marketing Specialist",
      company: "Digital Marketing Pro",
      status: "Accepted",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800">My Applications</h2>
        <p className="text-gray-500 mt-2">Manage your job applications here.</p>
      </div>

      {/* Application Form */}
      <div className="max-w-5xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800">Apply for a Job</h3>
        <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Company Name"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="file"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Application
          </button>
        </form>
      </div>

      {/* Submitted Applications List */}
      <div className="max-w-5xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800">Submitted Applications</h3>
        <ul className="mt-4 space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h4>
                <p className="text-gray-500">{app.company}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  app.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
