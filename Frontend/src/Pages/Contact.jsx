import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useState } from 'react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope className="text-3xl text-orange-500" />,
      title: "Email",
      value: "info@gogain.com",
      link: "mailto:support@gogain.com"
    },
    {
      icon: <FaPhoneAlt className="text-3xl text-orange-500" />,
      title: "Phone",
      value: "+977-984-1234-567",
      link: "tel:+9779841234567"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-orange-500" />,
      title: "Location",
      value: "Kawasoti-2, Panchakanya Chowk, Nawalpur, Gandaki Province, Nepal"
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0); // in seconds

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/user/contactform', formData);
      if (response.data.success) {
        setSubmitSuccess(true);
        // Start 5 minute cooldown (300 seconds)
        setCooldown(300);
        // Start countdown timer
        const timer = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to learn more about our services? Reach out to us anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mr-6">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map Embed */}
            <div className="overflow-hidden rounded-xl shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.383549968055!2d84.10172631506212!3d27.70544438279301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fbb5e5e9b6a5%3A0x3a3c3d3d3d3d3d3d!2sKawasoti-2%2C%20Panchakanya%20Chowk%2C%20Nawalpur%2C%20Gandaki%20Province%2C%20Nepal!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp" 
                width="100%" 
                height="300" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                className="rounded-xl"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                <p>Your message has been sent successfully!</p>
                {cooldown > 0 && (
                  <p className="mt-2 text-sm">
                    You can send another message in: {formatTime(cooldown)}
                  </p>
                )}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={cooldown > 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-gray-100"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={cooldown > 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-gray-100"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={cooldown > 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-gray-100"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={cooldown > 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-gray-100"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cooldown > 0}
                className={`w-full ${cooldown > 0 ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center`}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : cooldown > 0 ? (
                  `Wait ${formatTime(cooldown)}`
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;