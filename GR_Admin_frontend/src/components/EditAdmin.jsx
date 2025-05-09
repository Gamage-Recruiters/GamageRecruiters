import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditAdmin() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    role: '',
    status: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
  });
  const [adminPhoto, setAdminPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/admin/${adminId}`)
      .then((res) => {
        const admin = res.data.data[0];
        setFormData({
          name: admin.name || '',
          email: admin.email || '',
          gender: admin.gender || '',
          role: admin.role || '',
          status: admin.status || '',
          primaryPhoneNumber: admin.primaryPhoneNumber || '',
          secondaryPhoneNumber: admin.secondaryPhoneNumber || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
        setLoading(false);
      });
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAdminPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['name', 'email', 'gender', 'role', 'status', 'primaryPhoneNumber', 'secondaryPhoneNumber'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const form = new FormData();
    
    // Append all form data fields
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });
    
    // Append file if it exists
    if (adminPhoto) {
      form.append('adminPhoto', adminPhoto);
    }

    try {
      const response = await axios.put(`http://localhost:8000/admin/update/${adminId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.status === 200) {
        alert("Admin updated successfully!");
        navigate('/admins');
      } else {
        throw new Error(response.data || 'Update failed');
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data || "Update failed!");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-white bg-red-600 p-2 rounded">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Admin Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            placeholder="Name" 
            required 
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email *</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            placeholder="Email" 
            required 
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1">Gender *</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1">Role *</label>
          <input 
            type="text" 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            placeholder="Role" 
            required 
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1">Status *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Primary Phone Number */}
        <div>
          <label className="block mb-1">Primary Phone Number *</label>
          <input 
            type="text" 
            name="primaryPhoneNumber" 
            value={formData.primaryPhoneNumber} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            placeholder="Primary Phone Number" 
            required 
          />
        </div>

        {/* Secondary Phone Number */}
        <div>
          <label className="block mb-1">Secondary Phone Number *</label>
          <input 
            type="text" 
            name="secondaryPhoneNumber" 
            value={formData.secondaryPhoneNumber} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700" 
            placeholder="Secondary Phone Number" 
            required 
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1">Admin Photo</label>
          <input 
            type="file" 
            name="adminPhoto" 
            accept="image/*" 
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700" 
          />
        </div>

        {/* Submit */}
        <button 
          type="submit"
          className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold"
        >
          Update Admin
        </button>
      </form>
    </div>
  );
}

export default EditAdmin;