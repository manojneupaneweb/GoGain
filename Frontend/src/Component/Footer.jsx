import React from 'react';
import { FaDumbbell, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center mb-4">
              <FaDumbbell className="text-orange-500 text-2xl mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                GoGain
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Your ultimate fitness destination. Transform your body and mind with our expert trainers and top-notch facilities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 text-xl">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400 border-b border-orange-500 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Services', 'Pricing', 'Trainers', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400 border-b border-orange-500 pb-2">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-orange-400" />
                <span>123 Fitness Ave, Gym City, 10001</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-orange-400" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-orange-400" />
                <span>info@gogain.com</span>
              </li>
            </ul>
          </div>

          {/* Hours & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400 border-b border-orange-500 pb-2">Opening Hours</h3>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li className="flex items-center">
                <FaClock className="mr-3 text-orange-400" />
                Mon-Fri: 5:00 AM - 11:00 PM
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3 text-orange-400" />
                Sat-Sun: 7:00 AM - 9:00 PM
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 text-orange-400 border-b border-orange-500 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-3">Subscribe for fitness tips and offers</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="flex-grow px-3 py-2 bg-gray-800 text-white rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r font-medium transition-colors duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} GoGain Fitness. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;