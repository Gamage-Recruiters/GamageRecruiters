import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, AlertTriangle } from "lucide-react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import baseURL from "../../config/axiosPortConfig";
import 'react-toastify/dist/ReactToastify.css';

const AccountSettings = ({ user }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showTerminate, setShowTerminate] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    } 

    Swal.fire({
      title: 'Change Password',
      text: 'Are you sure you want to change your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update'
    }).then(async (result) => {
      if(result.isConfirmed) {
        try {
          const response = await axios.post(
            `${baseURL}/user/change-password`,
            {
              oldPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword,
              userId: user.userId
            },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Password changed successfully!',
              confirmButtonColor: '#3085d6',
            });
            
            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            });
            
            window.location.reload();
          }
        } catch (error) {
          console.error('Password Change Error:', error);
          setError(error.response?.data || 'Password change failed. Please check your current password.');
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response?.data || 'Password change failed',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  }, [passwordData, user.userId, navigate]);

  const handleTerminateAccount = () => {
    Swal.fire({
      title: 'Confirmation About Terminate Account',
      text: 'Are you sure you want to terminate your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63030',
      cancelButtonColor: '#333cdd',
      confirmButtonText: 'Terminate'
    }).then(async (result) => {
      if(result.isConfirmed) {
        try {
          const terminateAccountResponse = await axios.delete(`${baseURL}/user/delete-profile/${user.userId}`,{
            withCredentials: true
          });
          if(terminateAccountResponse.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Account Terminated!',
              text: 'User Account Terminated!',
              confirmButtonColor: '#3085d6',
            });
            localStorage.clear();
            navigate('/');
          } else {
            setError('Account Termination Failed');
            return;
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ToastContainer/>
      {/* Change Password Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Key size={20} /> Change Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Terminate Account Section */}
      <div className="pt-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} /> Terminate Account
        </h2>

        {!showTerminate ? (
          <div>
            <p className="text-gray-600 mb-4">
              Terminating your account will permanently delete all your data, applications, and profile information. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowTerminate(true)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              I want to terminate my account
            </button>
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 font-medium mb-4">
              Please confirm that you want to permanently delete your account and all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTerminate(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminateAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AccountSettings);
