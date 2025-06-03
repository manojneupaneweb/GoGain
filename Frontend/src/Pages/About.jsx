import React from 'react';

function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About GoGain
          </h1>
          <p className="mt-6 text-xl text-indigo-200 max-w-3xl mx-auto">
            Redefining fitness for the modern world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Welcome to GoGain</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              Founded in 2020, GoGain has rapidly emerged as a leader in the fitness industry by combining cutting-edge technology with proven training methodologies. What began as a single location with a vision to make fitness accessible has grown into a comprehensive platform serving thousands of members across multiple locations and through our digital offerings.
            </p>
            <p>
              Our mission is simple yet powerful: to empower individuals of all ages and fitness levels to achieve their health goals through personalized, science-backed approaches. We believe fitness should be rewarding, not intimidating, which is why we've created an environment where everyone from beginners to elite athletes can thrive.
            </p>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-16 bg-indigo-50 rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Holistic Approach</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              At GoGain, we view fitness as a complete lifestyle transformation, not just a series of workouts. Our philosophy centers on three pillars: physical health, mental wellbeing, and community support. We've designed every aspect of our facilities and programs to address these interconnected elements.
            </p>
            <p>
              Unlike traditional gyms, we foster a culture of encouragement rather than competition. Our members form genuine connections through group classes, challenges, and social events. This community aspect has proven to be the secret sauce for long-term success - when you're surrounded by like-minded people cheering for your progress, showing up becomes something you look forward to rather than dread.
            </p>
          </div>
        </section>

        {/* Programs */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Comprehensive Programs</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              GoGain offers an unparalleled variety of training options to suit every preference and goal. Our weight training facilities rival professional athletic centers, featuring the latest equipment from top manufacturers. For those focused on cardiovascular health, our dedicated cardio zones include everything from high-tech treadmills to immersive cycling studios.
            </p>
            <p>
              Beyond traditional gym offerings, we've developed specialty programs including yoga and mobility sessions for recovery, high-intensity interval training for fat loss, and strength-building regimens for serious athletes. Our personal coaching programs provide one-on-one guidance for members who want customized plans and accountability. Whatever your fitness aspirations, we have the tools and expertise to help you reach them.
            </p>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Fitness Meets Technology</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              GoGain stands at the forefront of the fitness technology revolution. Our proprietary app tracks your workouts, nutrition, and progress with seamless integration to all major wearable devices. Virtual coaching options bring expert guidance to your home or office, while our smart equipment automatically adjusts to your preferences and records your performance data.
            </p>
            <p>
              We've successfully blended the best of both worlds - the energy of in-person training with the convenience of digital tools. Members can attend live-streamed classes from our studios or access our extensive library of on-demand workouts. This hybrid approach ensures you never miss a session, whether you're traveling, working late, or simply prefer to exercise at home some days.
            </p>
          </div>
        </section>

        {/* Trainers */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">World-Class Training Team</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              What truly sets GoGain apart is our team of certified fitness professionals. Each trainer undergoes rigorous selection and continuous education to ensure they're equipped with the latest exercise science knowledge. More than just instructors, they serve as mentors, motivators, and partners in your health journey.
            </p>
            <p>
              From your very first visit, you'll notice the difference our personalized attention makes. Every new member receives a comprehensive fitness assessment and goal-setting consultation. Our trainers remember your name, your preferences, and your progress - creating a welcoming environment that feels more like a family than a gym.
            </p>
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-16 bg-indigo-50 rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Premier Facilities</h2>
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              We take immense pride in maintaining immaculate facilities with industry-leading equipment. Our cleaning protocols exceed health standards, with staff continuously sanitizing surfaces and providing ample self-cleaning stations for members. The air filtration systems in our facilities ensure optimal air quality during your workouts.
            </p>
            <p>
              Member satisfaction drives every decision we make. From the layout of our spaces to the selection of amenities, we've carefully considered every detail to enhance your experience. Our equipment is regularly upgraded, ensuring you always have access to the latest innovations in fitness technology. The result is an environment that inspires you to perform at your best while feeling completely comfortable.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Join the Fitness Revolution</h2>
          <div className="space-y-6 text-lg text-gray-700 max-w-4xl mx-auto">
            <p>
              At GoGain, we're more than just a gym - we're a movement dedicated to helping people unlock their full potential. Whether you're taking your first steps toward better health or training for elite competition, we have the resources, expertise, and community to support your journey.
            </p>
            <p>
              The path to a stronger, healthier, more confident you begins today. Visit any of our locations for a tour and complimentary workout, or explore our digital membership options. Your future self will thank you for taking this important step. Welcome to the GoGain family - where your fitness goals become reality.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="/membership"
              className="inline-block px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              Start Your Journey Today
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;