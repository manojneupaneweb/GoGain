import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function UserProfile() {
  const [profileData, setProfileData] = useState({
    user: null,
    orders: [],
    plans: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('/api/v1/user/getuserprofile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        if (response.data.success) {
          setProfileData({
            user: response.data.user,
            orders: response.data.orders || [],
            plans: response.data.plans || []
          });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
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

  if (!profileData.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">No user data found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-6 sm:px-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="relative">
                  <img
                    src={profileData.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.fullName)}&background=random`}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/50 object-cover shadow-md"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profileData.user.fullName}</h1>
                  <p className="text-indigo-100 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {profileData.user.role.charAt(0).toUpperCase() + profileData.user.role.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-indigo-100 mb-2">
                  Last active: {formatDateTime(profileData.user.last_login)}
                </p>
                <Link
                  to="/setting"
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md font-medium hover:bg-white/30 transition duration-300 border border-white/30"
                >Setting</Link>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8">
            {/* Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium">{profileData.user.fullName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{profileData.user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900 font-medium">{profileData.user.phone || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900 font-medium">{profileData.user.gender || 'N/A'}</p>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <p className="text-gray-900 font-medium">{formatDate(profileData.user.created_at)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900 font-medium">{formatDate(profileData.user.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Recent Orders
                  </h2>
                  <Link
                    to="/myproduct"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View All Orders
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {profileData.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {profileData.orders.map(order => (
                          <tr key={order.order_id}>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center text-sm gap-3 font-medium text-gray-900">
                              <img
                                src={order.product_image || 'https://via.placeholder.com/50'}
                                alt={order.product_name}
                                className="w-8 h-8 rounded-sm object-cover"
                              />
                              {order.product_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.product_price?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                      order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1).toLowerCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="mt-2 text-gray-500">No orders found</p>
                    <Link
                      to="/products"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Membership Plan */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Membership Plan</h2>
                {profileData.plans.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.plans.map(plan => (
                      <div key={plan.id} className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="font-semibold text-indigo-800">{plan.plan_name} Plan</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">{formatDate(plan.start_date)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expiry Date</p>
                            <p className="font-medium">{formatDate(plan.expire_date)}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${calculatePlanProgress(plan.start_date, plan.expire_date)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {calculateDaysRemaining(plan.expire_date)} days remaining
                          </p>
                        </div>
                        <button
                          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 text-sm"
                          disabled={isLoading}
                          onClick={() => navigate('/pricing')}
                        >
                          {isLoading ? 'Processing...' : 'Upgrade Plan'}
                        </button>


                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">No active membership</p>
                    <button
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Subscribe Now'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculatePlanProgress(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  if (now >= end) return 100;
  if (now <= start) return 0;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
}

function calculateDaysRemaining(endDate) {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default UserProfile;