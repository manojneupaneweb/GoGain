import React, { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaDumbbell } from 'react-icons/fa';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <FaDumbbell className="text-orange-500 text-3xl mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              GoGain
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              link="home" 
              activeLink={activeLink} 
              onClick={handleNavLinkClick}
            >
              Home
            </NavLink>
            <NavLink 
              link="about" 
              activeLink={activeLink} 
              onClick={handleNavLinkClick}
            >
              About
            </NavLink>
            <NavLink 
              link="services" 
              activeLink={activeLink} 
              onClick={handleNavLinkClick}
            >
              Services
            </NavLink>
            <NavLink 
              link="pricing" 
              activeLink={activeLink} 
              onClick={handleNavLinkClick}
            >
              Pricing
            </NavLink>
            <NavLink 
              link="contact" 
              activeLink={activeLink} 
              onClick={handleNavLinkClick}
            >
              Contact
            </NavLink>

            <div className="flex items-center space-x-4 ml-4">
              <button className="px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 flex items-center">
                <FaUser className="mr-2" /> Login
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-medium transition duration-300">
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
              <MobileNavLink 
                link="home" 
                activeLink={activeLink} 
                onClick={handleNavLinkClick}
              >
                Home
              </MobileNavLink>
              <MobileNavLink 
                link="about" 
                activeLink={activeLink} 
                onClick={handleNavLinkClick}
              >
                About
              </MobileNavLink>
              <MobileNavLink 
                link="services" 
                activeLink={activeLink} 
                onClick={handleNavLinkClick}
              >
                Services
              </MobileNavLink>
              <MobileNavLink 
                link="pricing" 
                activeLink={activeLink} 
                onClick={handleNavLinkClick}
              >
                Pricing
              </MobileNavLink>
              <MobileNavLink 
                link="contact" 
                activeLink={activeLink} 
                onClick={handleNavLinkClick}
              >
                Contact
              </MobileNavLink>

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300 flex items-center">
                  <FaUser className="mr-2" /> Login
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 w-full text-left px-4 py-2 rounded-md font-medium transition duration-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Reusable NavLink component for desktop
const NavLink = ({ children, link, activeLink, onClick }) => {
  const isActive = activeLink === link;
  return (
    <button
      onClick={() => onClick(link)}
      className={`relative px-2 py-1 font-medium transition duration-300 ${
        isActive ? 'text-orange-400' : 'text-white hover:text-orange-300'
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
      className={`px-4 py-2 text-left rounded-md transition duration-300 ${
        isActive 
          ? 'bg-orange-500 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

export default Header;