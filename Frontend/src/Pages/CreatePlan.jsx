import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function Createplan() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      const dataParam = searchParams.get('data');
      console.log("Payment Data Param:", dataParam);
      if (!dataParam) {
        setError('No payment data found in URL.');
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(dataParam));
        if (!decoded) {
          console.log("decoded not found");
          return
        }
        const planItem = localStorage.getItem("selectedPlan");
        if (!planItem) {
          throw new Error('No plan selected');
        }
        try {
          await axios.post(
            "/api/v1/cart/createplan",
            { planItem: JSON.parse(planItem) },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

        } catch (error) {
          console.error("❌ Error creating plan:", error);
          throw new Error(error.response?.data?.message || 'Failed to create plan');

        }
        toast.success('Plan created successfully! Redirecting in 15 seconds...');
        localStorage.removeItem('selectedPlan');

        setTimeout(() => {
          navigate('/profile');
        }, 15000); // 15000 ms = 15 seconds

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