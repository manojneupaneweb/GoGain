import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaLock, FaShieldAlt } from 'react-icons/fa';
import { initiateEsewaPayment } from '../utils/payment';
import { motion } from 'framer-motion';


function Pricing() {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('esewa');
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handleJoinNow = (plan) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setSelectedPlan(plan);
            setShowModal(true);
            return;
        }

        const amount = parseInt(plan.price.replace(/रु\. |,/g, '')); 
        setTotal(amount);
        setSelectedPlan(plan);
        setShowPaymentPopup(true);
    };

    const handleEsewaClick = (amount, plan) => {
        localStorage.setItem("selectedPlan", JSON.stringify({
            name: plan.name,
            duration: plan.duration,
        }));

        const redirectlink = '/createplan';
        initiateEsewaPayment(amount, 2736, redirectlink);
        setShowPaymentPopup(false);
    };

    const handleKhaltiClick = (amount) => {
        console.log(`Initiating Khalti payment for amount: ${amount}`);
        setShowPaymentPopup(false);
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
            {showPaymentPopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                    >
                        <div className="flex justify-between items-center border-b border-gray-100 p-5 bg-gradient-to-r from-orange-50 to-amber-50">
                            <h3 className="text-xl font-semibold text-gray-800">Complete Your Payment</h3>
                            <button
                                onClick={() => setShowPaymentPopup(false)}
                                className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className="flex border-b border-gray-100">
                                <button
                                    className={`flex-1 cursor-pointer py-3 px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'esewa'
                                        ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('esewa')}
                                >
                                    <span className="flex cursor-pointer items-center justify-center gap-2">
                                        <img src="https://www.drupal.org/files/project-images/esewa.png" alt="eSewa" className="h-10" />
                                    </span>
                                </button>
                                <button
                                    className={`flex-1 py-3 cursor-pointer px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'khalti'
                                        ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('khalti')}
                                >
                                    <span className="flex cursor-pointer items-center justify-center gap-2">
                                        <img src="https://cdn.selldone.com/app/contents/community/posts/images/CleanShot20221017at1413242xpng46cc84efd2abd15fcbd79171f835be14.png" alt="Khalti" className="h-5" />
                                    </span>
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                {activeTab === 'esewa' ? (
                                    <>
                                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                                            <h4 className="font-medium text-orange-800 mb-2">Test Credentials</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li className="flex items-start">
                                                    <span className="text-orange-500 mr-2">•</span>
                                                    <span>ID: <span className="font-mono">9806800001-5</span></span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-orange-500 mr-2">•</span>
                                                    <span>Password: <span className="font-mono">Nepal@123</span></span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-orange-500 mr-2">•</span>
                                                    <span>MPIN: <span className="font-mono">1122</span></span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-gray-500 text-sm mb-4">
                                                You'll be redirected to eSewa to complete your payment of
                                                <span className="font-bold text-gray-700"> रु. {total}</span>
                                            </p>
                                            <button
                                                onClick={() => handleEsewaClick(total, selectedPlan)}
                                                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <FaLock className="text-sm" />
                                                Pay with eSewa
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                            <h4 className="font-medium text-purple-800 mb-2">Test Credentials</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                <li className="flex items-start">
                                                    <span className="text-purple-500 mr-2">•</span>
                                                    <span>Mobile: <span className="font-mono">9800000000-9800000005</span></span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-purple-500 mr-2">•</span>
                                                    <span>MPIN: <span className="font-mono">1111</span></span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-purple-500 mr-2">•</span>
                                                    <span>OTP: <span className="font-mono">987654</span></span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-gray-500 text-sm mb-4">
                                                You'll be redirected to Khalti to complete your payment of
                                                <span className="font-bold text-gray-700"> रु. {total}</span>
                                            </p>
                                            <button
                                                onClick={() => handleKhaltiClick(total)}
                                                className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <FaShieldAlt className="text-sm" />
                                                Pay with Khalti
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 text-center">
                                    Your payment is secured with end-to-end encryption
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Choose Your Perfect Plan</h2>
                    <p className="mt-4 text-lg text-gray-600">Get fit with a plan that works for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                                onClick={() => handleJoinNow(plan)}
                                className={`mt-8 w-full py-3 rounded-md cursor-pointer font-semibold text-white transition ${plan.popular
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

            {/* Login Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-fade-in">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">You're not logged in</h3>
                            <p className="text-gray-600 mb-6">Please login to subscribe to the <strong>{selectedPlan?.name}</strong> plan.</p>
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