import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaUserCircle, FaEnvelope, FaLock, FaPhone,
  FaVenusMars, FaCalendarAlt, FaMapMarkerAlt,
  FaHome, FaImage, FaDumbbell, FaTimes, 
  FaSpinner, FaCheck, FaArrowLeft
} from 'react-icons/fa';

const Signup = ({ onClose, onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    gender: 'male',
    date_of_birth: '',
    avatar: null,
    location: ''
  });
  
  const [otp, setOtp] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;
    
    setIsSendingOTP(true);
    try {
      await axios.post('/api/v1/user/send-otp', { email: formData.email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }
    
    setIsVerifyingOTP(true);
    try {
      await axios.post('/api/v1/user/verify-otp', {
        email: formData.email,
        otp: otp.trim()
      });
      await handleRegister();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const res = await axios.post('/api/v1/user/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      localStorage.setItem('accessToken', res.data.token);
      toast.success('Registration successful!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSendOTP();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in relative border border-orange-400/30 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500 flex items-center">
            <FaDumbbell className="mr-2" /> 
            {step === 1 ? 'Join Our Gym!' : 'Verify Your Email'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaUserCircle className="mr-2" /> Full Name
                {errors.fullName && <span className="text-red-500 text-sm ml-auto">{errors.fullName}</span>}
              </label>
              <input
                name="fullName"
                type="text"
                className={`w-full px-4 py-2 bg-gray-700 border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaEnvelope className="mr-2" /> Email
                  {errors.email && <span className="text-red-500 text-sm ml-auto">{errors.email}</span>}
                </label>
                <input
                  name="email"
                  type="email"
                  className={`w-full px-4 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaLock className="mr-2" /> Password
                  {errors.password && <span className="text-red-500 text-sm ml-auto">{errors.password}</span>}
                </label>
                <input
                  name="password"
                  type="password"
                  className={`w-full px-4 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaPhone className="mr-2" /> Phone Number
                  {errors.phone && <span className="text-red-500 text-sm ml-auto">{errors.phone}</span>}
                </label>
                <input
                  name="phone"
                  type="tel"
                  className={`w-full px-4 py-2 bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaVenusMars className="mr-2" /> Gender
                </label>
                <select
                  name="gender"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaCalendarAlt className="mr-2" /> Date of Birth
                  {errors.date_of_birth && <span className="text-red-500 text-sm ml-auto">{errors.date_of_birth}</span>}
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  className={`w-full px-4 py-2 bg-gray-700 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaMapMarkerAlt className="mr-2" /> Location
                  {errors.location && <span className="text-red-500 text-sm ml-auto">{errors.location}</span>}
                </label>
                <input
                  name="location"
                  type="text"
                  className={`w-full px-4 py-2 bg-gray-700 border ${errors.location ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                  placeholder="Your location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaHome className="mr-2" /> Address
                {errors.address && <span className="text-red-500 text-sm ml-auto">{errors.address}</span>}
              </label>
              <input
                name="address"
                type="text"
                className={`w-full px-4 py-2 bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white`}
                placeholder="Full Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaImage className="mr-2" /> Profile Picture
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md border border-gray-600 transition duration-300">
                  Choose File
                  <input
                    name="avatar"
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </label>
                <span className="ml-2 text-gray-400 text-sm">
                  {formData.avatar ? formData.avatar.name : 'No file chosen'}
                </span>
              </div>
              {formData.avatar && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center shadow-lg"
              disabled={isSendingOTP}
            >
              {isSendingOTP ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Sending OTP...
                </>
              ) : (
                'Continue to Verification'
              )}
            </button>

            <div className="mt-4 text-center text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 text-gray-300">
              <p>We've sent a 6-digit verification code to:</p>
              <p className="font-bold text-orange-400 mt-1">{formData.email}</p>
              <p className="text-sm mt-2">Please check your inbox and enter the code below</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Verification Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-center text-xl tracking-widest"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              
              <button
                onClick={handleVerifyOTP}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center shadow-lg"
                disabled={isVerifyingOTP || isRegistering}
              >
                {isVerifyingOTP || isRegistering ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> 
                    {isRegistering ? 'Registering...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Verify & Register
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-gray-400 text-sm">
              Didn't receive code?{' '}
              <button
                onClick={handleSendOTP}
                className="text-orange-400 hover:text-orange-300"
                disabled={isSendingOTP}
              >
                {isSendingOTP ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;