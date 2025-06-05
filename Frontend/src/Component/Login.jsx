import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaDumbbell } from 'react-icons/fa';

const Login = ({ onClose, onSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500 flex items-center">
            <FaDumbbell className="mr-2" /> Welcome Back!
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
              <FaEnvelope className="mr-2" /> Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="flex text-gray-300 mb-2 items-center">
              <FaLock className="mr-2" /> Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              <>
                <FaUser className="mr-2 cursor-pointer" /> Login
              </>
            )}
          </button>
          
          <div className="mt-4 text-center text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-orange-400 hover:text-orange-300 cursor-pointer"            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;