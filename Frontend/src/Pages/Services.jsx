import React from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaRunning, FaHeartbeat, FaUsers, FaChalkboardTeacher, FaRegCalendarAlt, FaLeaf, FaTrophy } from 'react-icons/fa';
import { GiWeightLiftingUp, GiBoxingGlove, GiMeditation } from 'react-icons/gi';
import { IoMdNutrition } from 'react-icons/io';

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

function Services() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
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
            Our <span className="text-indigo-400">Services</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-indigo-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Comprehensive fitness solutions tailored to your goals
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Introduction */}
        <motion.section 
          className="mb-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Transform Your Fitness Journey</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            At GoGain, we offer a diverse range of services designed to meet every fitness need. Whether you're a beginner or an elite athlete, our expert-led programs and cutting-edge facilities will help you achieve extraordinary results.
          </p>
        </motion.section>

        {/* Training Programs */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Training Programs</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <GiWeightLiftingUp className="text-4xl text-indigo-600" />,
                title: "Strength Training",
                description: "Build muscle and increase power with our progressive resistance programs",
                benefits: [
                  "Personalized weight training plans",
                  "Technique perfection",
                  "Periodized programming"
                ]
              },
              {
                icon: <FaRunning className="text-4xl text-indigo-600" />,
                title: "Cardio Conditioning",
                description: "Improve endurance and cardiovascular health",
                benefits: [
                  "HIIT and steady-state options",
                  "Metabolic conditioning",
                  "Heart rate monitoring"
                ]
              },
              {
                icon: <GiBoxingGlove className="text-4xl text-indigo-600" />,
                title: "Combat Fitness",
                description: "Boxing, MMA and martial arts inspired workouts",
                benefits: [
                  "Bag work and pad drills",
                  "Defensive techniques",
                  "Full-body conditioning"
                ]
              },
              {
                icon: <GiMeditation className="text-4xl text-indigo-600" />,
                title: "Mind-Body Balance",
                description: "Yoga, Pilates and mobility training",
                benefits: [
                  "Flexibility improvement",
                  "Stress reduction",
                  "Injury prevention"
                ]
              },
              {
                icon: <FaUsers className="text-4xl text-indigo-600" />,
                title: "Group Training",
                description: "Motivating classes for all fitness levels",
                benefits: [
                  "30+ weekly class options",
                  "Themed workout challenges",
                  "Community atmosphere"
                ]
              },
              {
                icon: <FaTrophy className="text-4xl text-indigo-600" />,
                title: "Athlete Development",
                description: "Sport-specific performance enhancement",
                benefits: [
                  "Combine preparation",
                  "Agility training",
                  "Recovery protocols"
                ]
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
                <p className="text-gray-600 text-center mb-4">{item.description}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-4 w-4 text-indigo-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Specialized Services */}
        <motion.section 
          className="mb-24 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Specialized Services</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                {
                  icon: <FaChalkboardTeacher className="text-3xl text-indigo-600" />,
                  title: "Personal Training",
                  description: "One-on-one coaching with certified experts who create customized programs based on your goals, abilities, and schedule."
                },
                {
                  icon: <IoMdNutrition className="text-3xl text-indigo-600" />,
                  title: "Nutrition Planning",
                  description: "Macro-based meal plans and supplementation guidance to fuel your performance and recovery."
                },
                {
                  icon: <FaRegCalendarAlt className="text-3xl text-indigo-600" />,
                  title: "Program Design",
                  description: "Custom 12-week training cycles with progressive overload and deload phases."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start">
                    <div className="mr-4">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Personal training session" 
                className="w-full h-auto object-cover"
              />
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
            <h2 className="text-3xl font-extrabold mb-6">Ready to Transform Your Body?</h2>
            <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Take the first step towards a healthier, stronger you. Our team is ready to help you achieve your fitness goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/pricing"
                className="inline-block px-8 py-4 border-2 border-white text-base font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-indigo-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.a>
              <motion.a
                href="/product"
                className="inline-block px-8 py-4 border-2 border-white text-base font-medium rounded-full text-black bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Consultation
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default Services;