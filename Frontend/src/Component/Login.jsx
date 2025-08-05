import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaDumbbell, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onClose, onSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { email, password } = formData;
      const res = await axios.post('/api/v1/user/login', { email, password });
      localStorage.setItem('accessToken', res.data.token);
      toast.success('Login successful!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
        <div className="absolute -inset-1 bg-orange-500/10 rounded-2xl blur-sm"></div>
        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center">
              <FaDumbbell className="mr-2 animate-bounce" /> Welcome Back!
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaEnvelope className="mr-2 text-orange-400" /> Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaLock className="mr-2 text-orange-400" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Logging in...</span>
              ) : (
                <>
                  <FaUser className="mr-2" /> Login
                </>
              )}
            </button>
            
            <div className="mt-4 text-center text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-orange-400 hover:text-orange-300 cursor-pointer font-medium transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;