import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaFacebook, FaGlobe, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaUser } from 'react-icons/fa';

const ClientDetailsPage: React.FC = () => {
  // Mock client data - in a real application, you would fetch this data from an API or props
  const client = { 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'johndoe@example.com', 
    gender: 'Male', 
    birthDate: '1990-01-01', 
    phoneNumber1: '+1234567890', 
    phoneNumber2: '+0987654321', 
    address: '123 Main Street, City, Country', 
    address2: '123 Main Street, City, Country', 
    linkedInLink: 'https://www.linkedin.com/in/johndoe', 
    facebookLink: 'https://www.facebook.com/johndoe', 
    portfolioLink: 'https://johndoeportfolio.com', 
    profileDescription: 'Experienced software developer with expertise in web applications.', 
    cv: null, 
    photo: null 
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {client.photo ? (
                <img src={client.photo} alt={`${client.firstName} ${client.lastName}`} className="h-full w-full object-cover" />
              ) : (
                <FaUser className="text-white text-4xl" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{client.firstName} {client.lastName}</h1>
              <p className="text-gray-300 mt-2">{client.profileDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Personal Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="text-gray-900">{client.firstName} {client.lastName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <div className="flex items-center text-gray-900">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <a href={`mailto:${client.email}`} className="hover:text-gray-600">{client.email}</a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Gender</h3>
                  <p className="text-gray-900">{client.gender}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h3>
                  <div className="flex items-center text-gray-900">
                    <FaBirthdayCake className="text-gray-400 mr-2" />
                    <p>{new Date(client.birthDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Primary Phone</h3>
                  <div className="flex items-center text-gray-900">
                    <FaPhoneAlt className="text-gray-400 mr-2" />
                    <a href={`tel:${client.phoneNumber1}`} className="hover:text-gray-600">{client.phoneNumber1}</a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Secondary Phone</h3>
                  <div className="flex items-center text-gray-900">
                    <FaPhoneAlt className="text-gray-400 mr-2" />
                    <a href={`tel:${client.phoneNumber2}`} className="hover:text-gray-600">{client.phoneNumber2}</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Address Information</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Primary Address</h3>
                  <div className="flex items-start text-gray-900">
                    <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                    <p>{client.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Secondary Address</h3>
                  <div className="flex items-start text-gray-900">
                    <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
                    <p>{client.address2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Online Presence & Documents */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Online Presence</h2>
              
              <div className="space-y-4">
                {client.linkedInLink && (
                  <a 
                    href={client.linkedInLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaLinkedin className="text-blue-700 text-xl mr-3" />
                    <span className="text-gray-900">LinkedIn Profile</span>
                  </a>
                )}
                
                {client.facebookLink && (
                  <a 
                    href={client.facebookLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaFacebook className="text-blue-600 text-xl mr-3" />
                    <span className="text-gray-900">Facebook Profile</span>
                  </a>
                )}
                
                {client.portfolioLink && (
                  <a 
                    href={client.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaGlobe className="text-green-600 text-xl mr-3" />
                    <span className="text-gray-900">Portfolio Website</span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Documents</h2>
              
              <div className="space-y-4">
                <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
                  {client.cv ? (
                    <a 
                      href={client.cv} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      View CV / Resume
                    </a>
                  ) : (
                    <p className="text-gray-500">No CV/Resume available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-12 flex justify-end gap-4">
          <Link 
            to="/clients" 
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Clients
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;