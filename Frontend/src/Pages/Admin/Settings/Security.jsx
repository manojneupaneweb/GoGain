import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Security() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password requirements state
  const [requirements, setRequirements] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate new password requirements in real-time
    if (name === 'newPassword') {
      setRequirements({
        hasMinLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasUpperCase: /[A-Z]/.test(value)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/v1/admin/change-password', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Change Password</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border text-black rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-black border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-black'}`}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
          
          {/* Password requirements indicators */}
          <div className="mt-2 space-y-1">
            <div className={`flex items-center ${requirements.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${requirements.hasMinLength ? 'bg-green-600' : 'bg-gray-400'}`}></span>
              <span className="text-sm">At least 8 characters</span>
            </div>
            <div className={`flex items-center ${requirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${requirements.hasNumber ? 'bg-green-600' : 'bg-gray-400'}`}></span>
              <span className="text-sm">Contains a number</span>
            </div>
            <div className={`flex items-center ${requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${requirements.hasSpecialChar ? 'bg-green-600' : 'bg-gray-400'}`}></span>
              <span className="text-sm">Contains a special character</span>
            </div>
            <div className={`flex items-center ${requirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${requirements.hasUpperCase ? 'bg-green-600' : 'bg-gray-400'}`}></span>
              <span className="text-sm">Contains an uppercase letter</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-black border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default Security;