import React from 'react';
import { FaDumbbell, FaFire, FaHeartbeat, FaChartLine, FaStar, FaRunning, FaClock } from 'react-icons/fa';
const  gymImage = 'https://www.primalstrength.com/cdn/shop/files/gym_design_Headers.jpg?v=1680779429&width=2000';
const  trainer1 = 'https://www.primalstrength.com/cdn/shop/files/gym_design_Headers.jpg?v=1680779429&width=2000';
const  trainer2 = 'https://www.primalstrength.com/cdn/shop/files/gym_design_Headers.jpg?v=1680779429&width=2000';
const  trainer3 = 'https://www.primalstrength.com/cdn/shop/files/gym_design_Headers.jpg?v=1680779429&width=2000';

function Home() {
  const features = [
    { icon: <FaDumbbell className="text-4xl text-orange-500" />, title: "Modern Equipment", desc: "State-of-the-art gym equipment for all fitness levels" },
    { icon: <FaFire className="text-4xl text-orange-500" />, title: "Personal Training", desc: "Certified trainers to help you reach your goals" },
    { icon: <FaHeartbeat className="text-4xl text-orange-500" />, title: "Health Monitoring", desc: "Track your progress with our advanced systems" },
    { icon: <FaChartLine className="text-4xl text-orange-500" />, title: "Progress Tracking", desc: "Visualize your improvements over time" }
  ];

  const trainers = [
    { img: trainer1, name: "Alex Johnson", specialty: "Strength Training", rating: 5 },
    { img: trainer2, name: "Sarah Miller", specialty: "Yoga & Flexibility", rating: 5 },
    { img: trainer3, name: "Mike Rodriguez", specialty: "HIIT & Cardio", rating: 4 }
  ];

  const testimonials = [
    { quote: "GoGain transformed my life! Lost 30lbs in 3 months.", author: "James Wilson" },
    { quote: "Best gym I've ever joined. The trainers are amazing!", author: "Emily Chen" },
    { quote: "The community here keeps me motivated every day.", author: "David Kim" }
  ];

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your <span className="text-orange-500">Body</span>, Transform Your <span className="text-orange-500">Life</span>
            </h1>
            <p className="text-xl mb-8">
              Join GoGain today and start your journey to a healthier, stronger you with our world-class facilities and expert trainers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                <a href="/user">
                Get Started Today
                </a>
              </button>
              <button className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-6 border border-white rounded-md transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose GoGain?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to achieve your fitness goals in a supportive environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">About Our Gym</h2>
              <p className="text-lg text-gray-600 mb-6">
                GoGain was founded in 2010 with a mission to make fitness accessible to everyone. Our 10,000 sqft facility is equipped with the latest equipment and staffed by certified professionals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaRunning className="text-orange-500 mr-3 text-xl" />
                  <span className="text-gray-700">50+ classes weekly</span>
                </div>
                <div className="flex items-center">
                  <FaDumbbell className="text-orange-500 mr-3 text-xl" />
                  <span className="text-gray-700">200+ pieces of equipment</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-orange-500 mr-3 text-xl" />
                  <span className="text-gray-700">Open 24/7 for members</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-800 h-96 rounded-lg shadow-xl overflow-hidden">
                {/* Replace with your gym image */}
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                  <span>Gym Facility Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Trainers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our certified trainers are here to guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-64 bg-gray-300 flex items-center justify-center">
                  {/* Trainer image would go here */}
                  <span className="text-gray-600">Trainer Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                  <p className="text-orange-500 mb-3">{trainer.specialty}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < trainer.rating ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Hear from our members about their transformation journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-filter backdrop-blur-sm">
                <p className="text-xl italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join GoGain today and get your first week free with no commitment.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;