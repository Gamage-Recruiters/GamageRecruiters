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
    adminPhoto: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/admin/${adminId}`)
      .then((res) => {
        const admin = res.data;
        setFormData({
          name: admin.name || '',
          email: admin.email || '',
          gender: admin.gender || '',
          role: admin.role || '',
          status: admin.status || '',
          primaryPhoneNumber: admin.primaryPhoneNumber || '',
          secondaryPhoneNumber: admin.secondaryPhoneNumber || '',
          adminPhoto: null
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin data:', err);
        setLoading(false);
      });
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'adminPhoto') {
      setFormData({ ...formData, adminPhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }

    try {
      await axios.put(`http://localhost:8000/admin/update/${adminId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Admin updated successfully!");
      navigate('/admins');
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed!");
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Admin Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input type="text" name="name" value={formData.name} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" placeholder="Name" required />

        {/* Email */}
        <input type="email" name="email" value={formData.email} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" placeholder="Email" required />

        {/* Gender */}
        <select name="gender" value={formData.gender} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Role */}
        <input type="text" name="role" value={formData.role} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" placeholder="Role" required />

        {/* Status */}
        <select name="status" value={formData.status} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" required>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Primary Phone Number */}
        <input type="text" name="primaryPhoneNumber" value={formData.primaryPhoneNumber} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" placeholder="Primary Phone Number" required />

        {/* Secondary Phone Number */}
        <input type="text" name="secondaryPhoneNumber" value={formData.secondaryPhoneNumber} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" placeholder="Secondary Phone Number" required />

        {/* Image Upload */}
        <input type="file" name="adminPhoto" accept="image/*" onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700" />

        {/* Submit */}
        <button type="submit"
          className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold">
          Update Admin
        </button>
      </form>
    </div>
  );
}

export default EditAdmin;
