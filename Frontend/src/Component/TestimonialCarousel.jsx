import { useState, useRef, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialCarousel = () => {
  const testimonials = [
    {
      img: "https://randomuser.me/api/portraits/men/11.jpg",
      name: "Bikash Sharma",
      role: "Software Engineer",
      rating: 5,
      story: "GoGain helped me stay fit while working from home. Now even while coding, I feel energetic — ramro chha!"
    },
    {
      img: "https://randomuser.me/api/portraits/women/21.jpg",
      name: "Anusha Karki",
      role: "College Student",
      rating: 4,
      story: "During exam stress, GoGain’s short workouts kept me healthy and active. Dammi lagyo!"
    },
    {
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Sanjay Thapa",
      role: "Army Officer",
      rating: 5,
      story: "I already had discipline from training, but GoGain’s diet plan made my stamina double."
    },
    {
      img: "https://randomuser.me/api/portraits/women/40.jpg",
      name: "Pooja Shrestha",
      role: "Entrepreneur",
      rating: 5,
      story: "While running my business, I ignored my health. GoGain’s guidance helped me lose 10kg."
    },
    {
      img: "https://randomuser.me/api/portraits/men/46.jpg",
      name: "Kiran Lama",
      role: "Chef",
      rating: 4,
      story: "Being a food lover increased my weight. GoGain taught me how to stay slim without sacrificing taste."
    },
    {
      img: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "Sushmita Basnet",
      role: "Teacher",
      rating: 5,
      story: "Standing all day at school gave me back pain. Now my posture is perfect and my energy is unlimited."
    },
    {
      img: "https://randomuser.me/api/portraits/men/60.jpg",
      name: "Ramesh KC",
      role: "Farmer",
      rating: 5,
      story: "GoGain made my daily farm work much easier. Physical work no longer makes me tired."
    },
    {
      img: "https://randomuser.me/api/portraits/women/63.jpg",
      name: "Prerana Gurung",
      role: "Travel Blogger",
      rating: 5,
      story: "Traveling used to make me exhausted. GoGain’s workouts made hiking and trekking feel effortless."
    },
    {
      img: "https://randomuser.me/api/portraits/men/70.jpg",
      name: "Dipesh Magar",
      role: "Photographer",
      rating: 4,
      story: "After long photo shoots, my body used to ache. Now my flexibility is better, making work easier."
    },
    {
      img: "https://randomuser.me/api/portraits/women/75.jpg",
      name: "Mina Rai",
      role: "Housewife",
      rating: 5,
      story: "A 20-minute exercise between household chores boosts my energy levels every day."
    }
  ];

  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);
  const [visible, setVisible] = useState(3);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (pause) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.ceil(testimonials.length / visible));
    }, 4000);
    return () => clearInterval(interval);
  }, [pause, visible, testimonials.length]);

  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      const gap =
        parseInt(window.getComputedStyle(sliderRef.current).gap.replace("px", "")) || 24;
      const scrollAmount = current * (cardWidth + gap) * visible;
      sliderRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [current, visible]);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? Math.ceil(testimonials.length / visible) - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % Math.ceil(testimonials.length / visible));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-400 text-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold bg-white text-orange-600 rounded-full uppercase">
            Transformation Stories
          </span>
          <h2 className="text-4xl font-extrabold">
            Real <span className="text-amber-200">Success</span> Stories
          </h2>
          <p className="text-lg opacity-90 mt-4">
            Inspiring journeys of health and fitness.
          </p>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 cursor-pointer z-10 top-1/2 -translate-y-1/2 bg-white text-orange-600 p-3 rounded-full shadow-lg hover:bg-amber-200 transition"
        >
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute z-10 cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white text-orange-600 p-3 rounded-full shadow-lg hover:bg-amber-200 transition"
        >
          <FaChevronRight />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-x-hidden gap-6 hide-scrollbar"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              style={{ minWidth: `${100 / visible}%` }}
              className="flex-shrink-0 snap-start"
            >
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg border border-white/20 hover:scale-[1.02] transition-all h-full flex flex-col justify-between">
                <div className="flex items-center mb-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-14 h-14 rounded-full border-2 border-amber-400 mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-amber-200">{t.role}</p>
                  </div>
                </div>
                <p className="italic text-sm leading-relaxed">“{t.story}”</p>
                <div className="flex mt-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-300" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(testimonials.length / visible) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialCarousel;
