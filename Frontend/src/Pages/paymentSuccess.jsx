import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaShoppingBag, FaClock, FaArrowRight, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const dataParam = searchParams.get('data');
      if (!dataParam) {
        setError('No payment data found in URL.');
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(dataParam));
        setPaymentData(decoded);

        const orderResponse = await axios.post(
          "/api/v1/cart/createorder",
          { decoded },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Order Response:`, orderResponse.data);

        toast.success("Order placed successfully!");
        setOrderResponse(orderResponse.data);
        setLoading(false);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/profile');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        console.error("Order creation failed:", err);
        setError('Order creation failed. Please contact support.');
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8"
        >
          <FaClock className="text-6xl text-yellow-400" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">
          Processing Your Payment
        </h1>
        <p className="text-lg text-gray-300">
          Please wait while we confirm your transaction...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-rose-800 text-white p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Payment Processing Error</h1>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/cart'}
            className="bg-white text-red-800 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-all"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 flex flex-col items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white/20 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 0.8,
              ease: "backOut"
            }}
            className="inline-block mb-4"
          >
            <FaCheckCircle className="text-6xl text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Payment Successful!</h1>
          <p className="text-lg text-emerald-100">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="bg-white/5 rounded-xl p-6 mb-8 backdrop-blur-sm border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: { repeat: Infinity, duration: 3 }
                }}
              >
                <FaShoppingBag className="text-emerald-400" />
              </motion.span>
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Transaction ID</span>
                <span className="font-mono text-white">
                  {orderResponse?.transaction_id || paymentData?.transaction_uuid || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status</span>
                <motion.span
                  className="font-semibold text-emerald-400 uppercase flex items-center gap-1"
                  animate={{
                    x: [0, 5, -5, 0],
                    transition: { repeat: Infinity, duration: 2 }
                  }}
                >
                  {paymentData?.status}
                </motion.span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Product Code</span>
                <span className="text-white">{paymentData?.product_code}</span>
              </div>

              <div className="flex justify-between items-center text-lg pt-4 border-t border-white/10">
                <span className="text-gray-300">Total Amount</span>
                <span className="font-bold text-white flex items-center">
                  <motion.span
                    animate={{
                      scale: [1, 1.05, 1],
                      transition: { repeat: Infinity, duration: 2 }
                    }}
                  >
                    <FaBoxOpen className="mr-2 text-emerald-300" />
                  </motion.span>
                  रु. {paymentData?.total_amount?.toLocaleString() || '0.00'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/profile')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full flex-1 flex items-center justify-center gap-2 transition-all"
            >
              View Your Orders
              <motion.span
                animate={{
                  x: [0, 5, 0],
                  transition: { repeat: Infinity, duration: 1.5 }
                }}
              >
                <FaArrowRight />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/products')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full flex-1 border border-white/20 transition-all"
            >
              Continue Shopping
            </motion.button>
          </div>

          <div className="mt-6 text-center text-gray-300">
            <motion.p
              animate={{
                opacity: [0.7, 1, 0.7],
                transition: { repeat: Infinity, duration: 2 }
              }}
            >
              Redirecting to your profile in {countdown} seconds...
            </motion.p>
          </div>
        </div>
      </div>

      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -50,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            animate={{
              y: window.innerHeight,
              opacity: [0, 1, 0],
              x: Math.random() * 200 - 100
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: 5
            }}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              color: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 4)]
            }}
          >
            {['🎉', '✨', '🌟', '🎊', '💫'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSuccess;