import { Edit3, User, ExternalLink } from "lucide-react";

const ProfileOverview = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative group">
          <img
            src={user.photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 group-hover:border-indigo-300 transition-all"
          />
          <div className="absolute bottom-0 right-0 bg-indigo-500 p-1 rounded-full text-white">
            <Edit3 size={14} />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-600 mt-1">{user.profileDescription}</p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-3">
            {user.portfolioLink && (
              <a
                href={user.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
            )}
            {user.linkedInLink && (
              <a
                href={user.linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors"
              >
                <ExternalLink size={14} /> LinkedIn
              </a>
            )}
            {user.facebookLink && (
              <a
                href={user.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-700 transition-colors"
              >
                <ExternalLink size={14} /> Facebook
              </a>
            )}
          </div>
        </div>

        {/* User Meta Info */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-700">
            <User size={18} />
            User ID: {user.userId}
          </div>
          {user.cv && (
            <a
              href={user.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              View Resume
            </a>
          )}
        </div>
      </div>

      {/* Contact & Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Contact Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Contact Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Primary Phone:</span> {user.phoneNumber1}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Secondary:</span> {user.phoneNumber2}
            </p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Personal Details
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-medium">Address:</span> {user.address}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Birth Date:</span> {user.birthDate}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Age:</span> {user.age} years
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
