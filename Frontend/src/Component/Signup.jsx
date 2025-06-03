import { useState } from 'react';
import { 
  FaUserCircle, FaEnvelope, FaLock, FaPhone, 
  FaVenusMars, FaCalendarAlt, FaMapMarkerAlt, 
  FaHome, FaImage, FaDumbbell, FaTimes, FaSpinner 
} from 'react-icons/fa';

const Signup = ({ onClose, onSuccess, onSwitchToLogin, onOTPRequest, isSendingOTP }) => {
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      alert('Please fill all required fields');
      return;
    }
    onOTPRequest(formData.email);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in relative border border-orange-400/30 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500 flex items-center">
            <FaDumbbell className="mr-2" /> Join Our Gym!
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex text-gray-300 mb-2 items-center">
              <FaUserCircle className="mr-2" /> Full Name
            </label>
            <input
              name="fullName"
              type="text"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-gray-300 mb-2 items-center">
                <FaEnvelope className="mr-2" /> Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="flex text-gray-300 mb-2 items-center">
                <FaLock className="mr-2" /> Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex text-gray-300 mb-2 items-center">
                <FaPhone className="mr-2" /> Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
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
                required
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
              </label>
              <input
                name="date_of_birth"
                type="date"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="flex text-gray-300 mb-2 items-center">
                <FaMapMarkerAlt className="mr-2" /> Location
              </label>
              <input
                name="location"
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="Your location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex text-gray-300 mb-2 items-center">
              <FaHome className="mr-2" /> Address
            </label>
            <input
              name="address"
              type="text"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleInputChange}
              required
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
              'Create Account'
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
      </div>
    </div>
  );
};

export default Signup;