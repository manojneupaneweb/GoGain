import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function Createplan() {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        const planItem = localStorage.getItem("selectedPlan");
        if (!planItem) {
          throw new Error('No plan selected');
        }

        const response = await axios.post(
          "/api/v1/cart/createplan",
          { planItem: JSON.parse(planItem) }, // Parse the planItem if it's stored as JSON string
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("✅ plan Response:", response.data);
        toast.success("Plan created successfully!");

        localStorage.removeItem("selectedPlan");
        navigate('/profile');
      } catch (err) {
        console.error("❌ Plan creation failed:", err);
        const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Plan creation failed. Please contact support.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-400">
        <p className="animate-pulse text-xl">Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Plan Created Successfully</h1>
    </div>
  );
}

export default Createplan;