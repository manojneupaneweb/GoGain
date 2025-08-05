import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // optional if you're using toast

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const token = localStorage.getItem("accessToken");

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
        console.log("✅ Decoded Payment Data:", decoded);

        const res = await axios.get("/api/v1/cart/getcartitem", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data.data.items;

        

        const orderItems = items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          cartId: item.cartItemId,
          paymentStatus: decoded.status,
          orderStatus: "pending",
          address: item.address,
        }));
        console.log(orderItems.productId);
        

        const orderResponse = await axios.post(
          "/api/v1/cart/createorder",
          { orderItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Order Response:", orderResponse);

        toast.success("Order placed successfully!");
        setOrderResponse(orderResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Order creation failed:", err);
        setError('Order creation failed. Please contact support.');
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-400">
        <p className="animate-pulse text-xl">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-green-400 mb-2">PAYMENT SUCCESSFUL!</h1>
      <p className="text-white font-bold text-xl mb-8">
        {orderResponse?.transaction_id || paymentData?.transaction_uuid || 'N/A'}
      </p>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
      >
        START YOUR FITNESS JOURNEY
      </button>
    </div>
  );
};

export default PaymentSuccess;
