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
        console.log(`Subscribing to ${plan} plan`);
        // navigate('/checkout');
    };

    const plans = [
        {
            name: 'Basic',
            price: 'रु. 2000',
            duration: '1 Month',
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
            price: 'रु. 9000',
            duration: '3 Months',
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
            price: 'रु. 16000',
            duration: '6 Months',
            features: [
                '24/7 access',
                'All equipment + premium',
                'Unlimited classes',
                'Sauna & steam room',
                '5 trainer sessions'
            ],
            popular: false
        },
        {
            name: 'Elite Yearly',
            price: 'रु. 30000',
            duration: '1 Year',
            features: [
                'All premium benefits',
                'Priority trainer access',
                'Custom diet plan',
                'Monthly body analysis',
                'Unlimited everything'
            ],
            popular: false
        }
    ];


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Choose Your Perfect Plan</h2>
                    <p className="mt-4 text-lg text-gray-600">Get fit with a plan that works for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white border ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
                                } rounded-2xl shadow-md p-8 transition-transform duration-300 hover:scale-105`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-xl text-xs font-semibold">
                                    MOST POPULAR
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <div className="mt-4 text-4xl font-extrabold text-gray-800 flex items-baseline">
                                {plan.price}
                                <span className="ml-2 text-lg font-medium text-gray-500">/ {plan.duration}</span>


                            </div>

                            <ul className="mt-6 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3 text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleJoinNow(plan.name)}
                                className={`mt-8 w-full py-3 rounded-md font-semibold text-white transition ${plan.popular
                                        ? 'bg-indigo-600 hover:bg-indigo-700'
                                        : 'bg-gray-800 hover:bg-gray-900'
                                    }`}
                            >
                                Join Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">You're not logged in</h3>
                            <p className="text-gray-600 mb-6">Please login to subscribe to the <strong>{selectedPlan}</strong> plan.</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
