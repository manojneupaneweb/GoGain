import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaUserCircle, FaEnvelope, FaLock, FaPhone,
  FaVenusMars, FaCalendarAlt, FaMapMarkerAlt,
  FaHome, FaImage, FaDumbbell, FaTimes, 
  FaSpinner, FaCheck, FaArrowLeft, FaEye, FaEyeSlash,
  FaLocationArrow, FaMapPin
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
    location: '',
    coordinates: null
  });
  
  const [otp, setOtp] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, granted, denied
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Check if browser supports geolocation
  const isGeolocationSupported = 'geolocation' in navigator;

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getCurrentLocation = () => {
    if (!isGeolocationSupported) {
      toast.warning('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude }
        }));
        
        // Reverse geocode to get address (using a mock function here - you'd use a real API)
        reverseGeocode(latitude, longitude).then(address => {
          setFormData(prev => ({
            ...prev,
            location: address,
            address: address
          }));
          setLocationStatus('granted');
          toast.success('Location detected successfully!');
        }).catch(() => {
          setLocationStatus('granted');
          toast.success('Coordinates captured but address detection failed');
        });
      },
      (error) => {
        setLocationStatus('denied');
        toast.error('Location access was denied or failed');
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Mock reverse geocoding function - replace with actual API call
  const reverseGeocode = async (lat, lng) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }, 1000);
    });
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in relative border border-orange-400/30 overflow-y-auto max-h-screen">
        <div className="absolute -inset-1 bg-orange-500/10 rounded-2xl blur-sm"></div>
        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center">
              <FaDumbbell className="mr-2 animate-bounce" /> 
              {step === 1 ? 'Join Our Fitness Community!' : 'Verify Your Email'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTimes />
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaUserCircle className="mr-2 text-orange-400" /> Full Name
                  {errors.fullName && <span className="text-red-500 text-sm ml-auto">{errors.fullName}</span>}
                </label>
                <input
                  name="fullName"
                  type="text"
                  className={`w-full px-4 py-3 bg-gray-700/80 border ${errors.fullName ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaEnvelope className="mr-2 text-orange-400" /> Email
                    {errors.email && <span className="text-red-500 text-sm ml-auto">{errors.email}</span>}
                  </label>
                  <input
                    name="email"
                    type="email"
                    className={`w-full px-4 py-3 bg-gray-700/80 border ${errors.email ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaLock className="mr-2 text-orange-400" /> Password
                    {errors.password && <span className="text-red-500 text-sm ml-auto">{errors.password}</span>}
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 pr-12 bg-gray-700/80 border ${errors.password ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaPhone className="mr-2 text-orange-400" /> Phone Number
                    {errors.phone && <span className="text-red-500 text-sm ml-auto">{errors.phone}</span>}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className={`w-full px-4 py-3 bg-gray-700/80 border ${errors.phone ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaVenusMars className="mr-2 text-orange-400" /> Gender
                  </label>
                  <select
                    name="gender"
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white transition-all duration-200"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaCalendarAlt className="mr-2 text-orange-400" /> Date of Birth
                    {errors.date_of_birth && <span className="text-red-500 text-sm ml-auto">{errors.date_of_birth}</span>}
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    className={`w-full px-4 py-3 bg-gray-700/80 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white transition-all duration-200`}
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="flex text-gray-300 mb-2 items-center">
                    <FaMapMarkerAlt className="mr-2 text-orange-400" /> Location
                    {errors.location && <span className="text-red-500 text-sm ml-auto">{errors.location}</span>}
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="location"
                      type="text"
                      className={`flex-1 px-4 py-3 bg-gray-700/80 border ${errors.location ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                      placeholder="Your location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={!isGeolocationSupported || locationStatus === 'loading'}
                      className="bg-orange-500/80 hover:bg-orange-600 text-white px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Detect current location"
                    >
                      {locationStatus === 'loading' ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaLocationArrow />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaHome className="mr-2 text-orange-400" /> Address
                  {errors.address && <span className="text-red-500 text-sm ml-auto">{errors.address}</span>}
                </label>
                <input
                  name="address"
                  type="text"
                  className={`w-full px-4 py-3 bg-gray-700/80 border ${errors.address ? 'border-red-500' : 'border-gray-600/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200`}
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="flex text-gray-300 mb-2 items-center">
                  <FaImage className="mr-2 text-orange-400" /> Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg border border-orange-400/30 transition-all duration-300 shadow-md">
                    Choose File
                    <input
                      name="avatar"
                      type="file"
                      className="hidden"
                      onChange={handleInputChange}
                      accept="image/*"
                    />
                  </label>
                  <span className="text-gray-400 text-sm">
                    {formData.avatar ? formData.avatar.name : 'No file chosen'}
                  </span>
                </div>
                {formData.avatar && (
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-lg border border-gray-600/50"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, avatar: null}))}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/30"
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
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
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
                  className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-center text-xl tracking-widest transition-all duration-200"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                
                <button
                  onClick={handleVerifyOTP}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/30"
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
                  className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
                  disabled={isSendingOTP}
                >
                  {isSendingOTP ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;