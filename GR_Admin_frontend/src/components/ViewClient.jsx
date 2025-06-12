import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ViewClient() {
  const { userId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`${baseURL}/user/${userId}`);
        setClient(res.data.user
        );
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err.response?.data?.message || 'Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchClient();
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!client) return <div className="p-6 bg-yellow-100 rounded-lg text-yellow-700">Client not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Client Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Detail label="Full Name" value={`${client.firstName || ''} ${client.lastName || ''}`} />
        <Detail label="Gender" value={client.gender} />
        <Detail label="Birth Date" value={client.birthDate} />
        <Detail label="Email" value={client.email} />
        <Detail label="Phone 1" value={client.phoneNumber1} />
        <Detail label="Phone 2" value={client.phoneNumber2} />
        <Detail label="Address" value={client.address} />
        <Detail label="Address 2" value={client.address2} />
        
        {client.linkedInLink && (
          <div>
            <div className="text-gray-500 text-sm">LinkedIn</div>
            <div className="text-black font-medium">
              <a href={client.linkedInLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {client.linkedInLink}
              </a>
            </div>
          </div>
        )}
        
        {client.facebookLink && (
          <div>
            <div className="text-gray-500 text-sm">Facebook</div>
            <div className="text-black font-medium">
              <a href={client.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {client.facebookLink}
              </a>
            </div>
          </div>
        )}
        
        {client.portfolioLink && (
          <div>
            <div className="text-gray-500 text-sm">Portfolio</div>
            <div className="text-black font-medium">
              <a href={client.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {client.portfolioLink}
              </a>
            </div>
          </div>
        )}
        
        <Detail label="Profile Description" value={client.profileDescription} />
        
        {client.cv && (
          <div>
            <div className="text-gray-500 text-sm">CV</div>
            <div className="text-black font-medium">
              <a href={client.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                View CV
              </a>
            </div>
          </div>
        )}
        
        {client.photo && (
          <div>
            <div className="text-gray-500 text-sm">Photo</div>
            <div className="text-black font-medium mt-2">
              <img src={client.photo} alt="Profile" className="w-32 h-32 object-cover rounded-full border-2 border-gray-200" />
            </div>
          </div>
        )}
        
        <Detail 
          label="Created At" 
          value={client.createdAt ? new Date(client.createdAt).toLocaleString() : 'N/A'} 
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-black font-medium">{value || 'N/A'}</div>
    </div>
  );
}