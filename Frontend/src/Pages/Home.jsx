import React, { useRef, useState, useEffect } from 'react';
import { 
  FaDumbbell, 
  FaFire, 
  FaHeartbeat, 
  FaChartLine, 
  FaStar, 
  FaRunning, 
  FaClock, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaFacebook 
} from 'react-icons/fa';

// Assets
import hero1 from '../assets/gym-hero1.webp';
import hero2 from '../assets/gym-hero2.webp';
import hero3 from '../assets/gym-hero3.webp';
import about1 from '../assets/about.jpeg';
import trainer1 from '../assets/Trainers/trainer1.jpg';
import trainer2 from '../assets/Trainers/trainer2.jpg';
import trainer3 from '../assets/Trainers/trainer3.jpg';
import trainer4 from '../assets/Trainers/trainer4.jpg';
import trainer5 from '../assets/Trainers/trainer5.jpg';
import trainer6 from '../assets/Trainers/trainer6.jpg';

// Components
import TestimonialCarousel from '../Component/TestimonialCarousel';

// Constants
const HERO_SLIDES = [
  {
    image: hero1,
    title: "Transform Your Body, Transform Your Life",
    description: "Join GoGain today and start your journey to a healthier, stronger you with our world-class facilities and expert trainers."
  },
  {
    image: hero2,
    title: "Achieve Your Fitness Goals",
    description: "Customized workout plans designed to help you reach your personal fitness milestones."
  },
  {
    image: hero3,
    title: "Elevate Your Performance",
    description: "Premium equipment and professional guidance to take your training to the next level."
  }
];

const FEATURES = [
  { 
    icon: <FaDumbbell className="text-4xl text-orange-500" />, 
    title: "Modern Equipment", 
    desc: "State-of-the-art gym equipment for all fitness levels" 
  },
  { 
    icon: <FaFire className="text-4xl text-orange-500" />, 
    title: "Personal Training", 
    desc: "Certified trainers to help you reach your goals" 
  },
  { 
    icon: <FaHeartbeat className="text-4xl text-orange-500" />, 
    title: "Health Monitoring", 
    desc: "Track your progress with our advanced systems" 
  },
  { 
    icon: <FaChartLine className="text-4xl text-orange-500" />, 
    title: "Progress Tracking", 
    desc: "Visualize your improvements over time" 
  }
];

const TRAINERS = [
  { 
    img: trainer1, 
    name: 'Alex Johnson', 
    specialty: 'Strength Training', 
    rating: 5, 
    bio: 'Former competitive powerlifter with 10+ years coaching experience', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  },
  { 
    img: trainer2, 
    name: 'Sarah Miller', 
    specialty: 'Yoga & Flexibility', 
    rating: 5, 
    bio: 'Certified yoga instructor with expertise in mobility and rehabilitation', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  },
  { 
    img: trainer3, 
    name: 'Mike Rodriguez', 
    specialty: 'HIIT & Cardio', 
    rating: 4, 
    bio: 'Military fitness specialist creating high-intensity programs', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  },
  { 
    img: trainer4, 
    name: 'Emma Wilson', 
    specialty: 'Pilates', 
    rating: 5, 
    bio: 'Dancer-turned-trainer focusing on core strength and posture', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  },
  { 
    img: trainer5, 
    name: 'David Chen', 
    specialty: 'Olympic Weightlifting', 
    rating: 4, 
    bio: 'National champion weightlifter and certified sports nutritionist', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  },
  { 
    img: trainer6, 
    name: 'Lisa Park', 
    specialty: 'Functional Training', 
    rating: 5, 
    bio: 'Specializes in movement patterns for everyday life activities', 
    social: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' } 
  }
];

const SOCIAL_ICONS = {
  facebook: { icon: FaFacebook, color: 'bg-blue-600 hover:bg-blue-700' },
  instagram: { 
    icon: FaInstagram, 
    color: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
  },
  twitter: { icon: FaTwitter, color: 'bg-blue-400 hover:bg-blue-500' },
  linkedin: { icon: FaLinkedin, color: 'bg-blue-700 hover:bg-blue-800' }
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderHighlightedTitle = (title) => {
    const highlightWords = ['Body', 'Life', 'Goals', 'Performance'];
    return title.split(', ').map((part, i) => (
      <React.Fragment key={i}>
        {highlightWords.some(word => part.includes(word)) ? (
          <span className="text-orange-500">{part}</span>
        ) : (
          part
        )}
        {i < title.split(', ').length - 1 ? ', ' : ''}
      </React.Fragment>
    ));
  };

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto h-full flex items-center relative z-10 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            {renderHighlightedTitle(HERO_SLIDES[currentSlide].title)}
          </h1>
          <p className="text-white font-semibold sm:text-lg md:text-xl mb-6 sm:mb-8">
            {HERO_SLIDES[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md transition duration-300">
              <a href="/pricing">Get Started Today</a>
            </button>
            <button className="bg-transparent hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 border border-white rounded-md transition duration-300">
              <a href="/about">Learn More</a>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 sm:w-6' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

const Trainers = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleTrainers, setVisibleTrainers] = useState(3);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleTrainers(1);
      else if (window.innerWidth < 1024) setVisibleTrainers(2);
      else if (window.innerWidth < 1280) setVisibleTrainers(3);
      else if (window.innerWidth < 1536) setVisibleTrainers(4);
      else setVisibleTrainers(5);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.ceil(TRAINERS.length / visibleTrainers));
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, visibleTrainers]);

  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      const gap = parseInt(window.getComputedStyle(sliderRef.current).gap.replace('px', '')) || 24;
      const scrollAmount = currentSlide * (cardWidth + gap) * visibleTrainers;
      sliderRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentSlide, visibleTrainers]);

  const goToSlide = index => setCurrentSlide(index);

  const renderSocialIcons = (socialLinks) => {
    return Object.entries(socialLinks).map(([platform, url]) => {
      const { icon: Icon, color } = SOCIAL_ICONS[platform];
      return (
        <a 
          key={platform} 
          href={url} 
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${color} transition-all duration-300 transform hover:scale-125 shadow-md`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Icon size={14} />
        </a>
      );
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-orange-500 bg-orange-50 rounded-full uppercase tracking-wider">
            Elite Professionals
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Meet Our <span className="text-orange-500">Expert</span> Trainers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Our certified trainers combine knowledge, passion, and innovation to help you achieve your fitness goals.
          </p>
        </div>

        <div 
          ref={sliderRef} 
          className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth pb-8 -mx-4 px-4 hide-scrollbar" 
          onMouseEnter={() => setIsPaused(true)} 
          onMouseLeave={() => setIsPaused(false)}
        >
          {TRAINERS.map((trainer, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-4 snap-start transition-all duration-300" 
              style={{ minWidth: `${100 / visibleTrainers}%` }}
            >
              <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-orange-300/70 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col border border-transparent hover:border-orange-100">
                <div className="relative h-64 overflow-hidden cursor-pointer">
                  <img 
                    src={trainer.img} 
                    alt={trainer.name} 
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white text-sm md:text-base opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                      {trainer.bio}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    {renderSocialIcons(trainer.social)}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-300">
                        {trainer.name}
                      </h3>
                      <p className="text-orange-500 font-medium">{trainer.specialty}</p>
                    </div>
                    <div className="flex items-center bg-orange-100 px-2 py-1 rounded-full">
                      <FaStar className="text-yellow-400 mr-1" size={14} />
                      <span className="text-sm font-semibold text-gray-800">{trainer.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(TRAINERS.length / visibleTrainers) }).map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)} 
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 w-6' : 'bg-gray-300 hover:bg-gray-400'}`} 
              aria-label={`Go to slide ${index + 1}`} 
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Why Choose GoGain?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We provide everything you need to achieve your fitness goals in a supportive environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, index) => (
          <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="py-20 bg-gray-100 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto">
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
            <img src={about1} alt="Gym facility" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
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
);

const Home = () => {
  return (
    <div className="bg-gray-100">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <Trainers />
      <TestimonialCarousel />
      <CTASection />
    </div>
  );
};

export default Home;