import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaDumbbell, FaEye, FaEyeSlash, FaCheck, FaArrowLeft } from 'react-icons/fa';

const Login = ({ onClose, onSuccess, onSwitchToSignup }) => {
  // Login form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow state
  const [forgotPasswordStep, setForgotPasswordStep] = useState('login'); // 'login', 'email', 'otp', 'reset'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/v1/user/send-otp', { email: formData.email });
      toast.success('OTP sent to your email');
      setForgotPasswordStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/v1/user/verify-otp', {
        email: formData.email,
        otp: otp.trim()
      });
      toast.success('OTP verified successfully');
      setForgotPasswordStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/v1/user/forgetpassword', {
        email: formData.email,
        newPassword
      });
      toast.success('Password reset successfully');
      setForgotPasswordStep('login');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForgotPasswordContent = () => {
    switch (forgotPasswordStep) {
      case 'email':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-500">Reset Password</h3>
            <p className="text-gray-300">Enter your email to receive an OTP</p>
            
            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaEnvelope className="mr-2 text-orange-400" /> Email
              </label>
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

            <button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/20"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              onClick={() => setForgotPasswordStep('login')}
              className="flex items-center text-sm text-gray-400 hover:text-white mt-4"
            >
              <FaArrowLeft className="mr-1" /> Back to Login
            </button>
          </div>
        );

      case 'otp':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-500">Verify OTP</h3>
            <p className="text-gray-300">Enter the 6-digit OTP sent to {formData.email}</p>
            
            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaCheck className="mr-2 text-orange-400" /> OTP
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength="6"
                required
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/20"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setForgotPasswordStep('email')}
                className="flex items-center text-sm text-gray-400 hover:text-white"
              >
                <FaArrowLeft className="mr-1" /> Change Email
              </button>
              <button
                onClick={handleSendOtp}
                className="text-sm text-orange-400 hover:text-orange-300"
              >
                Resend OTP
              </button>
            </div>
          </div>
        );

      case 'reset':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-500">Set New Password</h3>
            <p className="text-gray-300">Create a new password for your account</p>
            
            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaLock className="mr-2 text-orange-400" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 chars)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-red-400 text-xs mt-1">Password must be at least 8 characters</p>
              )}
            </div>

            <div className="mb-4">
              <label className="flex text-gray-300 mb-2 items-center">
                <FaLock className="mr-2 text-orange-400" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-700/80 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-orange-500/20"
              disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              onClick={() => setForgotPasswordStep('otp')}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <FaArrowLeft className="mr-1" /> Back to OTP
            </button>
          </div>
        );

      default:
        return (
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
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6'>
              <button
                type="button"
                onClick={() => setForgotPasswordStep('email')}
                className="text-sm text-white hover:text-gray-200 cursor-pointer font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>

              <div className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-orange-400 hover:text-orange-300 cursor-pointer font-semibold transition-colors duration-200"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
        <div className="absolute -inset-1 bg-orange-500/10 rounded-2xl blur-sm"></div>
        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500 flex items-center">
              <FaDumbbell className="mr-2 animate-bounce" /> 
              {forgotPasswordStep === 'login' ? 'Welcome Back!' : 'Reset Password'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTimes />
            </button>
          </div>

          {renderForgotPasswordContent()}
        </div>
      </div>
    </div>
  );
};

export default Login;