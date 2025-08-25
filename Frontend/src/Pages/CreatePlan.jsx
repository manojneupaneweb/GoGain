import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaShoppingBag, FaClock, FaArrowRight, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Createplan() {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const pidx = searchParams.get('pidx');
      if (!pidx) {
        setError('No payment ID found in URL.');
        setLoading(false);
        return;
      }

      try {
        // Verify Khalti payment on backend
        const verifyRes = await axios.post(
          "/api/v1/payment/khalti/verify",
          { pidx },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!verifyRes.data || !verifyRes.data.success) {
          throw new Error(verifyRes.data?.message || 'Payment verification failed');
        }

        // Store payment data for display
        setPaymentData(verifyRes.data.data);

        // Payment verified → now create plan
        const planItem = localStorage.getItem("selectedPlan");
        if (!planItem) {
          throw new Error('No plan selected');
        }

        const planData = JSON.parse(planItem);

        // Create the plan
        await axios.post(
          "/api/v1/cart/createplan",
          { planItem: planData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        toast.success('Plan created successfully!');
        localStorage.removeItem('selectedPlan');
        setLoading(false);

        // Start countdown timer
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
        console.error("❌ Plan creation failed:", err);
        const errorMessage = err.response?.data?.message ||
          err.message ||
          'Plan creation failed. Please contact support.';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      }
    };

    processPayment();
  }, [searchParams, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8"
        >
          <FaClock className="text-6xl text-yellow-400" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2 text-center">Processing Your Payment</h1>
        <p className="text-lg text-gray-300 text-center">Please wait while we confirm your transaction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-rose-800 text-white p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaExclamationTriangle className="text-6xl mb-6 mx-auto text-yellow-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Plan Creation Error</h1>
          <p className="text-lg mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/plans')}
            className="bg-white text-red-800 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-all"
          >
            Back to Plans
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl">
        <div className="bg-white/20 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="inline-block mb-4"
          >
            <FaCheckCircle className="text-6xl text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Payment Successful!</h1>
          <p className="text-lg text-emerald-100">Your plan has been activated successfully</p>
        </div>

        <div className="p-8">
          <div className="bg-white/5 rounded-xl p-6 mb-8 backdrop-blur-sm border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <FaShoppingBag className="text-emerald-400" />
              </motion.span>
              Plan Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Transaction ID</span>
                <span className="font-mono text-white text-sm md:text-base">
                  {paymentData?.transaction_id || paymentData?.idx || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status</span>
                <motion.span
                  className="font-semibold text-emerald-400 uppercase flex items-center gap-1"
                  animate={{ x: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {paymentData?.status || 'Completed'}
                </motion.span>
              </div>
              <div className="flex justify-between items-center text-lg pt-4 border-t border-white/10">
                <span className="text-gray-300">Total Amount</span>
                <span className="font-bold text-white flex items-center">
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FaBoxOpen className="mr-2 text-emerald-300" />
                  </motion.span>
                  रु. {paymentData?.amount ? (paymentData.amount / 100).toLocaleString() : '0.00'}
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
              View Your Profile
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FaArrowRight />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/plans')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full flex-1 border border-white/20 transition-all"
            >
              Browse More Plans
            </motion.button>
          </div>

          <div className="mt-6 text-center text-gray-300">
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Redirecting to your profile in {countdown} seconds...
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createplan;