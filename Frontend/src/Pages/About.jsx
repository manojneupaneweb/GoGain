import React from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaHeartbeat, FaUsers, FaChartLine, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function About() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        className="relative bg-gray-900 h-96 md:h-screen/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-70"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"
          style={{ backgroundAttachment: 'fixed' }}
        ></div>
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About <span className="text-indigo-400">GoGain</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-indigo-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Redefining fitness for the modern world
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Introduction */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Welcome to GoGain</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-gray-700">
              <p className="leading-relaxed">
                Founded in 2020, GoGain has rapidly emerged as a leader in the fitness industry by combining <span className="font-semibold text-indigo-600">cutting-edge technology</span> with proven training methodologies. What began as a single location with a vision to make fitness accessible has grown into a comprehensive platform serving thousands of members.
              </p>
              <p className="leading-relaxed">
                Our mission is simple yet powerful: to <span className="font-semibold text-indigo-600">empower individuals</span> of all ages and fitness levels to achieve their health goals through personalized, science-backed approaches. We believe fitness should be rewarding, not intimidating.
              </p>
            </div>
            <motion.div 
              className="rounded-xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="GoGain gym" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Our Approach */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Holistic Approach</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <FaDumbbell className="text-4xl text-indigo-600" />,
                title: "Physical Health",
                description: "Science-backed training programs tailored to your unique physiology and goals."
              },
              {
                icon: <FaHeartbeat className="text-4xl text-indigo-600" />,
                title: "Mental Wellbeing",
                description: "Mindfulness and stress-reduction techniques integrated into all programs."
              },
              {
                icon: <FaUsers className="text-4xl text-indigo-600" />,
                title: "Community Support",
                description: "A network of like-minded individuals cheering for your success."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="text-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Programs */}
        <motion.section 
          className="mb-24 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Comprehensive Programs</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6 text-lg text-gray-700"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="leading-relaxed">
                GoGain offers an <span className="font-semibold text-indigo-600">unparalleled variety</span> of training options to suit every preference and goal. Our weight training facilities rival professional athletic centers, featuring the latest equipment from top manufacturers.
              </p>
              <p className="leading-relaxed">
                Beyond traditional gym offerings, we've developed <span className="font-semibold text-indigo-600">specialty programs</span> including yoga and mobility sessions for recovery, high-intensity interval training for fat loss, and strength-building regimens for serious athletes.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              ].map((src, index) => (
                <motion.div 
                  key={index}
                  className="rounded-xl overflow-hidden shadow-lg aspect-square"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={src} 
                    alt={`Program ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Technology */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Fitness Meets Technology</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-4 bg-indigo-100 rounded-2xl transform rotate-1 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg">
                <div className="space-y-6 text-lg text-gray-700">
                  <p className="leading-relaxed">
                    GoGain stands at the forefront of the <span className="font-semibold text-indigo-600">fitness technology revolution</span>. Our proprietary app tracks your workouts, nutrition, and progress with seamless integration to all major wearable devices.
                  </p>
                  <p className="leading-relaxed">
                    We've successfully blended the best of both worlds - the <span className="font-semibold text-indigo-600">energy of in-person training</span> with the convenience of digital tools. Members can attend live-streamed classes or access our extensive library of on-demand workouts.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                {
                  icon: <FaMobileAlt className="text-3xl text-indigo-600" />,
                  title: "Mobile App",
                  description: "Track all metrics in one place"
                },
                {
                  icon: <FaChartLine className="text-3xl text-indigo-600" />,
                  title: "Progress Analytics",
                  description: "Visualize your improvement"
                },
                {
                  icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
                  title: "Safety Features",
                  description: "Form correction technology"
                },
                {
                  icon: <FaUsers className="text-3xl text-indigo-600" />,
                  title: "Community",
                  description: "Connect with other members"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-3">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-extrabold mb-6">Join the Fitness Revolution</h2>
            <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
            <div className="space-y-6 text-lg max-w-4xl mx-auto">
              <p>
                At GoGain, we're more than just a gym - we're a movement dedicated to helping people <span className="font-semibold">unlock their full potential</span>.
              </p>
              <p>
                The path to a stronger, healthier, more confident you begins today. Welcome to the GoGain family - where your fitness goals become reality.
              </p>
            </div>
            <motion.div 
              className="mt-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/membership"
                className="inline-block px-8 py-4 border-2 border-white text-base font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-indigo-600 transition duration-300"
              >
                Start Your Journey Today
              </a>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default About;