import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaLinkedin, FaFacebook, FaGlobe, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const ClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const [client, setClient] = useState(null);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Hardcoded Client Data
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

  const handleEdit = () => {
    navigate(`/clients/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      // Example API call - Replace with your actual implementation
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      // Redirect to clients list page after successful deletion
      navigate('/clients');
    } catch (err) {
     setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error: {error}
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Client not found</h2>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Details</h1>
        <div className="space-x-2">
          <button 
            onClick={handleEdit} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Client information card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with photo */}
        <div className="bg-gray-800 text-white p-6">
          <div className="flex items-center">
            {client.photo ? (
              <img 
                src={URL.createObjectURL(client.photo)} 
                alt={`${client.firstName} ${client.lastName}`} 
                className="w-24 h-24 object-cover rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white">
                <FaUser className="text-gray-600 text-4xl" />
              </div>
            )}
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{client.firstName} {client.lastName}</h2>
              <p className="text-gray-300 mt-1">{client.gender || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Basic Information */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FaEnvelope className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaCalendarAlt className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Birth Date</p>
                  <p className="font-medium">{client.birthDate || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Primary Phone</p>
                  <p className="font-medium">{client.phoneNumber1 || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Secondary Phone</p>
                  <p className="font-medium">{client.phoneNumber2 || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start md:col-span-2">
                <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {client.address || 'No address provided'}
                    {client.address2 && <span><br />{client.address2}</span>}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FaLinkedin className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <a 
                    href={client.linkedInLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {client.linkedInLink || 'Not provided'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaFacebook className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Facebook</p>
                  <a 
                    href={client.facebookLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {client.facebookLink || 'Not provided'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <FaGlobe className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Portfolio</p>
                  <a 
                    href={client.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {client.portfolioLink || 'Not provided'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500">CV/Resume</p>
                  {client.cv ? (
                    <a 
                      href={URL.createObjectURL(client.cv)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View CV
                    </a>
                  ) : (
                    <p className="font-medium">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Profile Description */}
          <section>
            <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Profile Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {client.profileDescription || 'No profile description provided.'}
            </p>
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete {client.firstName} {client.lastName}'s profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsPage;