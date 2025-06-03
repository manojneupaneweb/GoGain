import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const navigate = useNavigate();

  const handleJoinNow = (plan) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setSelectedPlan(plan);
      setShowModal(true);
      return;
    }
    // Proceed with subscription logic for logged-in users
    console.log(`Subscribing to ${plan} plan`);
    // navigate('/checkout'); // Uncomment to navigate to checkout
  };

  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      features: [
        'Access to cardio area',
        'Standard equipment',
        'Locker room access',
        'Limited classes',
        'No personal trainer'
      ],
      popular: false
    },
    {
      name: 'Standard',
      price: '$49',
      period: '/month',
      features: [
        'Full gym access',
        'All equipment',
        'Unlimited classes',
        'Sauna access',
        '1 free trainer session'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '$79',
      period: '/month',
      features: [
        '24/7 access',
        'All equipment + premium',
        'Unlimited classes',
        'Sauna & steam room',
        '5 trainer sessions'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Perfect Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get fit with a plan that works for you
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-200'
              } bg-white`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900">
                  {plan.price}
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => handleJoinNow(plan.name)}
                    className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    } transition duration-300`}
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                You're not logged in
              </h3>
              <p className="text-gray-600 mb-6">
                Please login to subscribe to our {selectedPlan} plan.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pricing;