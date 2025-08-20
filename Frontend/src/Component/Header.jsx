import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaTimes, FaUser, FaDumbbell, FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Signup from './Signup';
import OTPVerification from './OTPVerification';
import handelLogout from '../utils/Logout.js';
import { useCart } from '../utils/CartContext.jsx';

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
  // const otpTimerRef = useRef(null);
  const { cartCount } = useCart();


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
      console.error('Error fetching user data:', error);
    }
  };

  // Track current URL and set active link based on it
  useEffect(() => {
    fetchUserData();

    // Set active link based on current URL path
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/home') {
      setActiveLink('home');
    } else if (currentPath.includes('/about')) {
      setActiveLink('about');
    } else if (currentPath.includes('/services')) {
      setActiveLink('services');
    } else if (currentPath.includes('/pricing')) {
      setActiveLink('pricing');
    } else if (currentPath.includes('/product')) {
      setActiveLink('product');
    } else if (currentPath.includes('/contact')) {
      setActiveLink('contact');
    } else {
      setActiveLink(''); // No active link for pages not in nav
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);

    // Check if it's a hash-based navigation or actual page navigation
    if (link === 'home') {
      window.location.href = '/';
    } else {
      // For other links, try both hash navigation and page navigation
      const section = document.getElementById(link);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // If no section found, navigate to the page
        window.location.href = `/${link}`;
      }
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
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
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
        className="mt-16"
      />

      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl sticky top-0 z-50 border-b border-gray-700">
        <div className="container mx-auto px-4 md:px-10 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <motion.div>
                  <FaDumbbell className="text-orange-500 text-2xl mr-3 transition-all duration-300 group-hover:text-orange-400 drop-shadow-lg" />
                </motion.div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 bg-clip-text text-transparent tracking-tight">
                  GoGain
                </h1>
              </motion.div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center space-x-2">
                {[
                  { key: 'home', label: 'Home', path: '/' },
                  { key: 'about', label: 'About', path: '/about' },
                  { key: 'services', label: 'Services', path: '/services' },
                  { key: 'pricing', label: 'Pricing', path: '/pricing' },
                  { key: 'product', label: 'Products', path: '/product' },
                  { key: 'contact', label: 'Contact', path: '/contact' }
                ].map((item) => (
                  <NavLink
                    key={item.key}
                    link={item.key}
                    label={item.label}
                    path={item.path}
                    activeLink={activeLink}
                    onClick={handleNavLinkClick}
                  />
                ))}
              </nav>
            </div>

            {/* Cart and Auth Section */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/cart"
                  className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 px-3 py-2 rounded-lg text-gray-200 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl group"
                >
                  <motion.div whileHover={{ rotate: 10 }} className="relative">
                    <FaShoppingCart className="text-lg group-hover:text-orange-400 transition-colors duration-300" />
                    <motion.span
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg"
                      animate={{ scale: cartCount > 0 ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {cartCount}
                    </motion.span>
                  </motion.div>
                  <span className="font-medium text-sm">Cart</span>
                </a>
              </motion.div>

              {/* Auth Buttons */}
              {userLoggedIn ? (
                <UserDropdown userData={userData} />
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogin(true)}
                    className="px-5 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center font-medium text-gray-200 hover:text-white group border border-gray-600 hover:border-gray-500"
                  >
                    <FaUser className="mr-2 group-hover:text-blue-400 transition-colors duration-300 text-sm" />
                    LOGIN
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(249, 115, 22, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSignup(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30 border border-orange-400"
                  >
                    SIGN UP
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Section */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Cart */}
              <motion.a
                href="/cart"
                className="relative text-white hover:text-orange-400 transition-colors duration-300"
                whileTap={{ scale: 0.9 }}
              >
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </motion.a>

              {/* Mobile Auth */}
              {!userLoggedIn ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLogin(true)}
                    className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
                  >
                    LOGIN
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSignup(true)}
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300"
                  >
                    SIGNUP
                  </motion.button>
                </>
              ) : (
                <UserDropdownMobile userData={userData} />
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 5 }}
                className="text-white focus:outline-none p-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaTimes className="text-2xl" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaBars className="text-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
              >
                <motion.div
                  className="flex flex-col space-y-2 pt-6 pb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {[
                    { key: 'home', label: 'Home', path: '/' },
                    { key: 'about', label: 'About', path: '/about' },
                    { key: 'services', label: 'Services', path: '/services' },
                    { key: 'pricing', label: 'Pricing', path: '/pricing' },
                    { key: 'product', label: 'Products', path: '/product' },
                    { key: 'contact', label: 'Contact', path: '/contact' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <MobileNavLink
                        link={item.key}
                        label={item.label}
                        path={item.path}
                        activeLink={activeLink}
                        onClick={handleNavLinkClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Popups */}
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
        className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-500 shadow-lg hover:shadow-xl"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <p className="text-sm font-medium text-gray-200">
          Hi, <span className="text-orange-400 font-semibold">{userData?.fullName}</span>
        </p>

        {userData?.avatar ? (
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-orange-400 shadow-md hover:border-orange-300 transition-colors duration-300"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center shadow-md border-2 border-gray-400">
            <FaUser className="text-gray-200 text-sm" />
          </div>
        )}

        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <FaChevronDown className="text-gray-300 text-sm" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl py-2 z-50 border border-gray-600"
          >
            {userData?.role === 'user' && (
              <>
                <DropdownItem href="/profile">My profile</DropdownItem>
                <DropdownItem href="/dashboard">View dashboard</DropdownItem>
                <DropdownItem href="/myorder">My Order</DropdownItem>
                <DropdownItem href="/setting">Settings</DropdownItem>
              </>
            )}
            {userData?.role === 'trainer' && (
              <>
                <DropdownItem href="/trainer-dashboard">Trainer dashboard</DropdownItem>
              <DropdownItem href="/myorder">My Order</DropdownItem>
                <DropdownItem href="/setting">Setting</DropdownItem>
              </>
            )}
            {userData?.role === 'admin' && (
              <DropdownItem href="/admin/dashboard">Admin dashboard</DropdownItem>
            )}
            <div className="border-t border-gray-700 my-2"></div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handelLogout}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white font-medium transition-all duration-300 rounded-lg mx-1"
            >
              Logout
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
    <div className="flex items-center relative">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="flex items-center cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {userData?.avatar ? (
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-400">
            <FaUser className="text-white text-sm" />
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="absolute right-0 top-12 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl py-2 z-50 border border-gray-600 min-w-48"
          >
            <div className="px-4 py-2 text-orange-400 text-sm font-bold border-b border-gray-700">
              HI, {userData?.fullName?.toUpperCase() || userData?.email?.toUpperCase() || 'USER'}
            </div>

            {userData?.role === 'user' && (
              <>
                <MobileDropdownItem href="/profile">My profile</MobileDropdownItem>
                <MobileDropdownItem href="/dashboard">Dashboard</MobileDropdownItem>
                <MobileDropdownItem href="/myorder">Products</MobileDropdownItem>
                <MobileDropdownItem href="/setting">Settings</MobileDropdownItem>
              </>
            )}

            {userData?.role === 'trainer' && (
              <>
                <MobileDropdownItem href="/trainer-dashboard">Trainer dashboard</MobileDropdownItem>
                <MobileDropdownItem href="/setting">Setting</MobileDropdownItem>
              </>
            )}

            {userData?.role === 'admin' && (
              <MobileDropdownItem href="/admin/dashboard">Admin dashboard</MobileDropdownItem>
            )}

            <div className="border-t border-gray-700 my-1"></div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handelLogout}
              className="px-4 py-2 text-left text-gray-300 hover:bg-red-600 hover:text-white font-medium transition-all duration-300 text-sm w-full"
            >
              Logout
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

const DropdownItem = ({ href, children }) => (
  <motion.a
    whileTap={{ scale: 0.98 }}
    href={href}
    className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white text-sm font-medium transition-all duration-300 mx-1 rounded-lg"
  >
    {children}
  </motion.a>
);

const MobileDropdownItem = ({ href, children }) => (
  <motion.a
    whileTap={{ scale: 0.98 }}
    href={href}
    className="px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white text-sm block font-medium transition-all duration-300"
  >
    {children}
  </motion.a>
);

const NavLink = ({ link, label, path, activeLink, onClick }) => {
  const isActive = activeLink === link;

  return (
    <motion.a
      href={path}
      onClick={(e) => {
        e.preventDefault();
        onClick(link);
      }}
      className={`relative px-4 py-2 font-semibold transition-all duration-300 cursor-pointer rounded-lg group ${isActive
        ? 'text-orange-400 bg-gradient-to-r from-orange-500/20 to-transparent'
        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="navUnderline"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
          transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
        />
      )}
      <motion.span
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: isActive ? 0 : 1 }}
      />
    </motion.a>
  );
};

const MobileNavLink = ({ link, label, path, activeLink, onClick }) => {
  const isActive = activeLink === link;

  return (
    <motion.a
      href={path}
      onClick={(e) => {
        e.preventDefault();
        onClick(link);
      }}
      className={`px-6 py-4 text-left rounded-xl transition-all duration-300 cursor-pointer font-bold mx-2 ${isActive
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:text-white'
        }`}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.a>
  );
};

export default Header;