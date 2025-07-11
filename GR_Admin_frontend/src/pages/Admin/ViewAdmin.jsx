import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../config/baseUrlConfig';

function ViewAdmin() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${baseURL}/admin/${adminId}`, { 
      withCredentials: true  
    })
      .then((res) => {
        setAdmin(res.data.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admin details:", err);
        setLoading(false);
      });
  }, [adminId]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!admin) return <p className="text-red-500">Admin not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">View Admin Details</h2>

      <div className="space-y-4">
        <Detail label="Name" value={admin.name} />
        <Detail label="Email" value={admin.email} />
        <Detail label="Gender" value={admin.gender} />
        <Detail label="Role" value={admin.role} />
        <Detail label="Status" value={admin.status} />
        <Detail label="Primary Phone" value={admin.primaryPhoneNumber} />
        <Detail label="Secondary Phone" value={admin?.secondaryPhoneNumber} />

        {admin.image && (
          <div>
            <label className="font-semibold block mb-1">Profile Image</label>
            <img
              src={`${baseURL}/uploads/admin/images/${admin.image}`}
              alt="Admin"
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/admins')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Back to Admin List
        </button>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <label className="font-semibold">{label}:</label>
    <p className="bg-gray-800 p-2 rounded mt-1">{value || 'N/A'}</p>
  </div>
);

export default ViewAdmin;
