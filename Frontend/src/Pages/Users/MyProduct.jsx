import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyProduct() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('/api/v1/users/myorders', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        if (response.data?.success) {
          // Sort orders: pending first, then shipping, then completed
          const sortedOrders = (response.data.orders || []).sort((a, b) => {
            const statusOrder = { 'pending': 1, 'shipping': 2, 'completed': 3 };
            const aStatus = a.order_status?.toLowerCase() || '';
            const bStatus = b.order_status?.toLowerCase() || '';
            return statusOrder[aStatus] - statusOrder[bStatus];
          });
          setOrders(sortedOrders);
        } else {
          setError(response.data?.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setError(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const statusStr = status ? String(status).toLowerCase() : '';
    switch (statusStr) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (seconds < 60) return 'Just now';
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <div className="mt-6">
              <Link
                to="/product"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order?._id || Math.random()}
                className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order?.order_id || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatTimeAgo(order?.createdAt)}
                      </p>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.order_status)}`}>
                      {order?.order_status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                      <img
                        className="h-full w-full object-cover"
                        src={order.product_image || 'https://via.placeholder.com/150'}
                        alt={order.product_name}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-900">
                        {order.product_name || 'Product not available'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {order?.quantity || 1}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-base font-medium text-gray-900">
                        {formatPrice(order?.product_price * (order?.quantity || 1))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total: <span className="font-medium text-gray-900">
                        {formatPrice(order?.product_price * (order?.quantity || 1))}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProduct;