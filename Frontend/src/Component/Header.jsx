import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaBars, FaTimes, FaUser, FaDumbbell, FaLock, FaEnvelope,
  FaPhone, FaHome, FaUserCircle, FaImage, FaVenusMars, FaCalendarAlt,
  FaMapMarkerAlt, FaCheck, FaSpinner
} from 'react-icons/fa';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [canResendOTP, setCanResendOTP] = useState(false);
  const otpTimerRef = useRef(null);

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

  // Start OTP countdown timer
  useEffect(() => {
    if (showOTP && otpTimer > 0) {
      otpTimerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(otpTimerRef.current);
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
    };
  }, [showOTP, otpTimer]);

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, location: coords }));
        },
        (error) => {
          console.error("Location error:", error.message);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await axios.post('/api/v1/user/login', { email, password });
      console.log('Login Success:', res.data);
      setShowLogin(false);
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log('Login Error:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Login failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password || !formData.fullName) {
        toast.error('Please fill all required fields', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      setIsSendingOTP(true);
      try {
        const response = await axios.post('/api/v1/user/send-otp', {
          email: formData.email
        });

        if (response.status === 200 || response.message == "OTP sent successfully") {
          setEmailForOTP(formData.email);
          setShowOTP(true);
          setOtpTimer(300);
          setCanResendOTP(false);
          toast.success('OTP sent to your email!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error(response.data?.message || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        toast.error(error.message || 'Failed to send OTP');
        throw error;
      } finally {
        setIsSendingOTP(false);
      }
    } catch (err) {
      console.log('Error details:', err);
      console.error('Signup Error:', err.response?.data?.message || err.message);

      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Step 1: Verify OTP
      const verifyResponse = await axios.post(
        '/api/v1/user/verify-otp',
        { email: emailForOTP, otp: otpValue },
        { withCredentials: true }
      );

      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || 'OTP verification failed');
      }

      toast.success('OTP verified successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setShowOTP(false);

      const formToSend = new FormData();
      formToSend.append('fullName', formData.fullName);
      formToSend.append('email', formData.email);
      formToSend.append('phone', formData.phone);
      formToSend.append('password', formData.password);
      formToSend.append('address', formData.address);
      formToSend.append('gender', formData.gender);
      formToSend.append('date_of_birth', formData.date_of_birth);
      formToSend.append('location', formData.location);
      if (formData.avatar) {
        formToSend.append('avatar', formData.avatar);
      }

      const registerResponse = await axios.post('/api/v1/user/register', formToSend);
      console.log('Register Response:', registerResponse.data);
      setShowLogin(true);
      toast.success('Account created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset all states
      setFormData({
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
      setOtp(['', '', '', '', '', '']);
      setShowSignup(false);
      setShowOTP(false);
      clearInterval(otpTimerRef.current);


    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Something went wrong', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsVerifying(false);
    }
  };


  const resendOTP = async () => {
    try {
      setIsSendingOTP(true);
      const response = await axios.post('/api/v1/user/send-otp', {
        email: emailForOTP
      });

      if (response.data.success) {
        setOtpTimer(300);
        setCanResendOTP(false);
        setOtp(['', '', '', '', '', '']);
        toast.success('New OTP sent to your email!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP Error:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Failed to resend OTP. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const PopupOverlay = () => (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="/">
              <div className="flex items-center">
                <FaDumbbell className="text-orange-500 text-3xl mr-2" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  GoGain
                </h1>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink link="home" className="cursor-pointer" activeLink={activeLink} onClick={handleNavLinkClick}>Home</NavLink>
              <NavLink link="about" className="cursor-pointer" activeLink={activeLink} onClick={handleNavLinkClick}>About</NavLink>
              <NavLink link="services" className="cursor-pointer" activeLink={activeLink} onClick={handleNavLinkClick}>Services</NavLink>
              <NavLink link="pricing" className="cursor-pointer" activeLink={activeLink} onClick={handleNavLinkClick}>Pricing</NavLink>
              <NavLink link="contact" className="cursor-pointer" activeLink={activeLink} onClick={handleNavLinkClick}>Contact</NavLink>
              <div className="flex items-center space-x-4 ml-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 flex items-center"
                >
                  <FaUser className="mr-2" /> Login
                </button>
                <button
                  onClick={() => setShowSignup(true)}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-medium transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                <MobileNavLink link="home" activeLink={activeLink} onClick={handleNavLinkClick}>Home</MobileNavLink>
                <MobileNavLink link="about" activeLink={activeLink} onClick={handleNavLinkClick}>About</MobileNavLink>
                <MobileNavLink link="services" activeLink={activeLink} onClick={handleNavLinkClick}>Services</MobileNavLink>
                <MobileNavLink link="pricing" activeLink={activeLink} onClick={handleNavLinkClick}>Pricing</MobileNavLink>
                <MobileNavLink link="contact" activeLink={activeLink} onClick={handleNavLinkClick}>Contact</MobileNavLink>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className=" cursor-pointer w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300 flex items-center"
                  >
                    <FaUser className="mr-2 cursor-pointer" /> Login
                  </button>
                  <button
                    onClick={() => {
                      setShowSignup(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 w-full text-left px-4 py-2 rounded-md font-medium transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Login Popup */}
      {showLogin && (
        <>
          <PopupOverlay />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                  <FaDumbbell className="mr-2" /> Welcome Back!
                </h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleLoginSubmit}>
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
                >
                  <FaUser className="mr-2" /> Login
                </button>
                <div className="mt-4 text-center text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogin(false);
                      setShowSignup(true);
                    }}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Signup Popup */}
      {showSignup && (
        <>
          <PopupOverlay />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fade-in relative border border-orange-400/30 overflow-y-auto max-h-screen">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                  <FaDumbbell className="mr-2" /> Join Our Gym!
                </h2>
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSignupSubmit}>
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
                    <>
                      <FaUser className="mr-2" /> Create Account
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignup(false);
                      setShowLogin(true);
                    }}
                    className="text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* OTP Verification Popup */}
      {showOTP && (
        <>
          <PopupOverlay />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                  <FaDumbbell className="mr-2" /> Verify Your Email
                </h2>
                <button
                  onClick={() => {
                    setShowOTP(false);
                    setShowSignup(true);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-300 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-medium text-white">{emailForOTP}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {otpTimer > 0 ? (
                    `Code expires in ${formatTime(otpTimer)}`
                  ) : (
                    <span className="text-orange-400">Code expired</span>
                  )}
                </p>
              </div>

              <form onSubmit={handleOTPSubmit}>
                <div className="flex justify-center space-x-3 mb-8">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-2xl text-center bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      value={otp[index]}
                      onChange={(e) => handleOTPChange(e, index)}
                      onKeyDown={(e) => handleOTPKeyDown(e, index)}
                      pattern="\d*"
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className={`w-full ${otp.join('').length === 6 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-600 cursor-not-allowed'} text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center`}
                  disabled={otp.join('').length !== 6 || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Verifying...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Verify & Register
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-gray-400">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={resendOTP}
                    className={`font-medium ${canResendOTP ? 'text-orange-400 hover:text-orange-300' : 'text-gray-500 cursor-not-allowed'}`}
                    disabled={!canResendOTP || isSendingOTP}
                  >
                    {isSendingOTP ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Reusable NavLink component for desktop
const NavLink = ({ children, link, activeLink, onClick }) => {
  const isActive = activeLink === link;
  return (
    <button
      onClick={() => onClick(link)}
      className={`relative px-2 py-1 font-medium transition duration-300 ${isActive ? 'text-orange-400' : 'text-white hover:text-orange-300'
        }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
      )}
    </button>
  );
};

// Reusable NavLink component for mobile
const MobileNavLink = ({ children, link, activeLink, onClick }) => {
  const isActive = activeLink === link;
  return (
    <button
      onClick={() => onClick(link)}
      className={`px-4 py-2 text-left rounded-md transition duration-300 ${isActive
        ? 'bg-orange-500 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
    >
      {children}
    </button>
  );
};

export default Header;