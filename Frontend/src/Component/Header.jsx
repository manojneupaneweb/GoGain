import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaTimes, FaUser, FaDumbbell, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Signup from './Signup';
import OTPVerification from './OTPVerification';
import handelLogout from '../utils/Logout.js';

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
  const [otpTimer, setOtpTimer] = useState(300);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const otpTimerRef = useRef(null);

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUserLoggedIn(false);
        return;
      }

      const response = await axios.get('/api/v1/user/getuser', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        setUserLoggedIn(true);
        setUserData(response.data.user);
      } else {
        setUserLoggedIn(false);
      }
    } catch (error) {
      setUserLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);

    const section = document.getElementById(link);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    fetchUserData();
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    setShowLogin(true);
  };

  const PopupOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
    />
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

      <header className="bg-gray-900 text-white shadow-lg sticky px-14 top-0 z-50">
        <div className="container mx-auto px-4 md:px-10 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <FaDumbbell className="text-orange-500 text-3xl mr-2 transition-transform group-hover:rotate-12" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  GoGain
                </h1>
              </motion.div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center space-x-8">
                {['home', 'about', 'services', 'pricing', 'product', 'contact'].map((link) => (
                  <a
                    key={link}
                    href={`${link}`}
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   handleNavLinkClick(link);
                    // }}
                    className={`relative px-4 py-2 font-bold transition duration-300 cursor-pointer ${activeLink === link ? 'text-orange-400' : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </a>
                ))}
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {userLoggedIn ? (
                <UserDropdown userData={userData} />
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 flex items-center cursor-pointer hover:text-blue-600"
                  >
                    <FaUser className="mr-2" /> LOGIN
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSignup(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-md font-medium transition duration-300 cursor-pointer shadow-lg hover:shadow-orange-500/20"
                  >
                    SIGN UP
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {!userLoggedIn ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLogin(true)}
                    className="text-white"
                  >
                    LOGIN
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSignup(true)}
                    className="text-orange-500"
                  >
                    SIGNUP
                  </motion.button>
                </>
              ) : (
                <UserDropdownMobile userData={userData} />
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-white focus:outline-none"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-2xl" />
                ) : (
                  <FaBars className="text-2xl" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col space-y-3 pt-4 pb-4">
                  {['home', 'about', 'services', 'pricing','product', 'contact'].map((link) => {
                   link ? 'home' : link=='/';
                    return (
                      <MobileNavLink
                        key={link}
                        link={link}
                        activeLink={activeLink}
                        onClick={handleNavLinkClick}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Login Popup */}
      <AnimatePresence>
        {showLogin && (
          <>
            <PopupOverlay />
            <Login
              onClose={() => setShowLogin(false)}
              onSuccess={handleLoginSuccess}
              onSwitchToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Signup Popup */}
      <AnimatePresence>
        {showSignup && (
          <>
            <PopupOverlay />
            <Signup
              onClose={() => setShowSignup(false)}
              onSuccess={handleSignupSuccess}
              onSwitchToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              onOTPRequest={(email) => {
                setEmailForOTP(email);
                setShowSignup(false);
                setShowOTP(true);
              }}
              isSendingOTP={isSendingOTP}
            />
          </>
        )}
      </AnimatePresence>

      {/* OTP Verification Popup */}
      <AnimatePresence>
        {showOTP && (
          <>
            <PopupOverlay />
            <OTPVerification
              email={emailForOTP}
              otp={otp}
              setOtp={setOtp}
              onClose={() => {
                setShowOTP(false);
                setShowSignup(true);
              }}
              onSuccess={handleOTPSuccess}
              otpTimer={otpTimer}
              setOtpTimer={setOtpTimer}
              canResendOTP={canResendOTP}
              setCanResendOTP={setCanResendOTP}
              isVerifying={isVerifying}
              setIsVerifying={setIsVerifying}
              isSendingOTP={isSendingOTP}
              setIsSendingOTP={setIsSendingOTP}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const UserDropdown = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        className="flex items-center gap-3 cursor-pointer px-4 py-2   rounded-full transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <p className="text-sm font-medium text-gray-700">
          Hi, <span className="text-orange-500">{userData?.fullName}</span>
        </p>

        {userData?.avatar ? (
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
            <FaUser className="text-gray-600" />
          </div>
        )}

        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <FaChevronDown className="text-gray-500 text-sm" />
        </motion.div>
      </motion.div>


      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
          >
            {userData?.role === 'user' && (
              <>
                <DropdownItem href="/profile">MY PROFILE</DropdownItem>
                <DropdownItem href="/dashboard">VIEW DASHBOARD</DropdownItem>
                <DropdownItem href="/myproduct">PRODUCT STATUS</DropdownItem>
                <DropdownItem href="/setting">SETTING</DropdownItem>
              </>
            )}
            {userData?.role === 'trainer' && (
              <>
                <DropdownItem href="/trainer-dashboard">TRAINER DASHBOARD</DropdownItem>
                <DropdownItem href="/products">PRODUCT STATUS</DropdownItem>
                <DropdownItem href="/trainees">MY TRAINEES</DropdownItem>
                <DropdownItem href="/progress">MY PROGRESS</DropdownItem>
              </>
            )}
            {userData?.role === 'admin' && (
              <DropdownItem href="/admin/dashboard">ADMIN DASHBOARD</DropdownItem>
            )}
            <div className="border-t border-gray-700 my-1"></div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handelLogout}
              className="block w-full text-left px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700 hover:text-white"
            >
              LOGOUT
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserDropdownMobile = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex items-center">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="flex items-center cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {userData?.avatar ? (
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 p-1 flex items-center justify-center">
            <FaUser className="text-white text-sm" />
          </div>
        )}
      </motion.div>

      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute right-4 top-16 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
        >
          <div className="px-4 py-2 text-gray-300 text-sm">
            HI, {userData?.fullName?.toUpperCase() || userData?.email?.toUpperCase() || 'USER'}
          </div>
          {userData?.role === 'user' && (
            <>
              <MobileDropdownItem href="/profile">My Profile</MobileDropdownItem>
              <MobileDropdownItem href="/dashboard">VIEW DASHBOARD</MobileDropdownItem>
              <MobileDropdownItem href="/products">PRODUCT STATUS</MobileDropdownItem>
              <MobileDropdownItem href="/progress">MY PROGRESS</MobileDropdownItem>
            </>
          )}
          {userData?.role === 'trainer' && (
            <>
              <MobileDropdownItem href="/trainer-dashboard">TRAINER DASHBOARD</MobileDropdownItem>
              <MobileDropdownItem href="/products">PRODUCT STATUS</MobileDropdownItem>
              <MobileDropdownItem href="/trainees">MY TRAINEES</MobileDropdownItem>
              <MobileDropdownItem href="/progress">MY PROGRESS</MobileDropdownItem>
            </>
          )}
          {userData?.role === 'admin' && (
            <MobileDropdownItem href="/admin/dashboard">ADMIN DASHBOARD</MobileDropdownItem>
          )}
          <div className="border-t border-gray-700 my-1"></div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handelLogout}
            className="px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-md cursor-pointer text-sm w-full"
          >
            LOGOUT
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

const DropdownItem = ({ href, children }) => (
  <motion.a
    whileTap={{ scale: 0.98 }}
    href={href}
    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white text-sm"
  >
    {children}
  </motion.a>
);

const MobileDropdownItem = ({ href, children }) => (
  <motion.a
    whileTap={{ scale: 0.98 }}
    href={href}
    className="px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-md text-sm block"
  >
    {children}
  </motion.a>
);

const NavLink = ({ link, activeLink, onClick }) => {
  const isActive = activeLink === link;
  const linkText = link.toUpperCase();

  return (
    <a
      href={`#${link}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(link);
      }}
      className={`relative px-4 py-2 font-bold transition duration-300 cursor-pointer ${isActive ? 'text-orange-400' : 'text-gray-300 hover:text-white'
        }`}
    >
      {linkText}
      {isActive && (
        <motion.span
          layoutId="navUnderline"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"
          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
        />
      )}
    </a>
  );
};

const MobileNavLink = ({ link, activeLink, onClick }) => {
  const isActive = activeLink === link;
  const linkText = link.toUpperCase();

  return (
    <a
      href={`#${link}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(link);
      }}
      className={`px-6 py-3 text-left rounded-md transition duration-300 cursor-pointer font-bold ${isActive
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
    >
      {linkText}
    </a>
  );
};

export default Header;