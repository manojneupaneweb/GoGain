import { useState } from 'react';
import { FaTimes, FaLock, FaShieldAlt } from 'react-icons/fa';
import { initiateKhaltiPayment } from '../utils/payment';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [total, setTotal] = useState(0);
    const verifyUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return false
        };

        try {
            const response = await axios.get('/api/v1/user/verify-user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { success: response.data.success, role: response.data.role };
        } catch (error) {
            console.error('Error verifying user:', error);
            localStorage.removeItem('accessToken');
            return false;
        }
    };

    const handleJoinNow = async (plan) => {
        const { success, role } = await verifyUser();

        if (role === 'trainer' || role === 'admin') {
            toast.info(`As a ${role}, you don't need to buy a plan in GoGain 💪`, {
                autoClose: 2000,
            });

            return;
        }



        if (!success) {
            setSelectedPlan(plan);
            localStorage.removeItem('accessToken');
            toast.error('Please login to continue', {
                autoClose: 1000,
            });
            return;
        }

        const amount = Number(plan.price.replace(/रु\. |,/g, ''));
        setTotal(amount);
        setSelectedPlan(plan);
        setShowPaymentPopup(true);
    };

    // Handle payment via Khalti (placeholder)
    const handleKhaltiClick = (amount, plan) => {
        localStorage.setItem(
            'selectedPlan',
            JSON.stringify({ name: plan.name, price: amount, duration: plan.duration })
        );
        const redirectLink = 'createplan';
        initiateKhaltiPayment(amount, 2736, redirectLink);
        setShowPaymentPopup(false);
    };

    // Membership plans data
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
                'No personal trainer',
            ],
            popular: false,
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
                '1 free trainer session',
            ],
            popular: true,
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
                '5 trainer sessions',
            ],
            popular: false,
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
                'Unlimited everything',
            ],
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            {/* Payment Popup */}
            <ToastContainer />
            {showPaymentPopup && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <Motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-gray-100 p-5 bg-gradient-to-r from-orange-50 to-amber-50">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Complete Your Payment
                            </h3>
                            <button
                                onClick={() => setShowPaymentPopup(false)}
                                className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close payment popup"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Payment Tabs */}
                        <div className="p-5">
                            <div className="flex border-b border-gray-100">
                                <button
                                    className={`flex-1 py-3 cursor-pointer px-4  text-sm uppercase tracking-wide transition-colors duration-200 
                                        text-purple-600 border-b-2 border-purple-600 font-semibold
                                        `}
                                >
                                    <img
                                        src="https://cdn.selldone.com/app/contents/community/posts/images/CleanShot20221017at1413242xpng46cc84efd2abd15fcbd79171f835be14.png"
                                        alt="Khalti"
                                        className="h-5 mx-auto"
                                    />
                                </button>
                            </div>

                            {/* Payment Details */}
                            <div className="mt-6 space-y-4">
                                <>
                                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                        <h4 className="font-medium text-purple-800 mb-2">
                                            Test Credentials
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>
                                                <strong>Mobile:</strong>{' '}
                                                <code>9800000000-9800000005</code>
                                            </li>
                                            <li>
                                                <strong>MPIN:</strong> <code>1111</code>
                                            </li>
                                            <li>
                                                <strong>OTP:</strong> <code>987654</code>
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-4">
                                        You'll be redirected to Khalti to complete your payment of{' '}
                                        <strong>रु. {total}</strong>
                                    </p>
                                    <button
                                        onClick={() => handleKhaltiClick(total, selectedPlan)}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                                    >
                                        <FaShieldAlt className="text-sm" />
                                        Pay with Khalti
                                    </button>
                                </>
                            </div>

                            <p className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                                Your payment is secured with end-to-end encryption
                            </p>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}

            {/* Pricing Plans */}
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Choose Your Perfect Plan
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Get fit with a plan that works for you
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, idx) => (
                        <article
                            key={idx}
                            className={`relative bg-white border rounded-2xl shadow-md p-8 transition-transform duration-300 hover:scale-105 ${plan.popular
                                ? 'border-indigo-500 ring-2 ring-indigo-500'
                                : 'border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <span className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-xl text-xs font-semibold">
                                    MOST POPULAR
                                </span>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-800">
                                {plan.price}
                                <span className="ml-2 text-lg font-medium text-gray-500">
                                    / {plan.duration}
                                </span>
                            </div>

                            <ul className="mt-6 space-y-3 text-gray-700">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <svg
                                            className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
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
                                        <span className="ml-3">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleJoinNow(plan)}
                                className={`mt-8 w-full py-3 cursor-pointer rounded-md font-semibold text-white transition-colors duration-300 ${plan.popular
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-800 hover:bg-gray-900'
                                    }`}
                            >
                                Join Now
                            </button>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default Pricing;
