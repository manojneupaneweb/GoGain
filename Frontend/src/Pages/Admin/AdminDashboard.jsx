import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage, FiTruck, FiCheck, FiX, FiXCircle, FiClock } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/v1/admin/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-6 max-w-md">
          <h3 className="text-lg font-medium text-gray-100 mb-2">Error loading dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate total sales from completed orders
  const totalSales = dashboardData?.order_status_counts?.completed_orders || 0;
  const pendingOrders = dashboardData?.order_status_counts?.pending_orders || 0;
  const shippingOrders = dashboardData?.order_status_counts?.shipping_orders || 0;
  const cancelledOrders = dashboardData?.order_status_counts?.cancelled_orders || 0;

  

  // Prepare chart data from API response
  const orderStatusData = {
    labels: ['pending', 'shipping', 'completed', 'cancelled'],
    datasets: [
      {
        data: [
          parseInt(dashboardData?.order_status_counts?.pending_orders) || 0,
          parseInt(dashboardData?.order_status_counts?.shipping_orders) || 0,
          parseInt(dashboardData?.order_status_counts?.completed_orders) || 0,
          parseInt(dashboardData?.order_status_counts?.cancelled_orders) || 0
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Stats cards data from API
  const stats = [
    {
      title: 'Total Users',
      value: dashboardData?.total_users || 0,
      icon: <FiUsers size={24} />,
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Total Products',
      value: dashboardData?.total_products || 0,
      icon: <FiPackage size={24} />,
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Total Sales',
      value: totalSales,
      icon: <FiShoppingCart size={24} />,
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardData?.total_revenue?.toLocaleString() || 0}`,
      icon: <FiDollarSign size={24} />,
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <FiClock size={24} />,  // Represents waiting/time
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Shipping Orders',
      value: shippingOrders,
      icon: <FiTruck size={24} />,  // Represents delivery/shipping
      change: '+0%',
      trend: 'neutral'
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders,
      icon: <FiXCircle size={24} />,  // Represents cancellation
      change: '+0%',
      trend: 'neutral'
    },
];

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-400' :
                    stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-700 text-blue-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-auto w-32 ">
        {/* Order Status Chart */}
        <div className="bg-gray-800 p-3 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
      <Pie
        data={orderStatusData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#f3f4f6'
              }
            },
          },
        }}
      />
    </div>

        {/* Empty Chart Placeholder */ }
  <div className="bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
    <div className="text-center text-gray-400">
      <FiTruck className="mx-auto h-12 w-12 mb-4" />
      <p>Additional data visualization will appear here</p>
    </div>
  </div>
      </div >

    {/* Recent Orders */ }
    < div className = "bg-gray-800 p-6 rounded-lg shadow" >
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          {dashboardData?.recent_orders?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dashboardData.recent_orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400">#{order.id.substring(0, 8)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.order_status === 'completed' ? 'bg-green-900 text-green-300' :
                        order.order_status === 'shipping' ? 'bg-blue-900 text-blue-300' :
                        order.order_status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      ${order.total_amount || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FiPackage className="mx-auto h-12 w-12 mb-4" />
              <p>No recent orders found</p>
            </div>
          )}
        </div>
      </div >

    {/* Top Products */ }
    < div className = "bg-gray-800 p-6 rounded-lg shadow" >
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          {dashboardData?.top_products?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dashboardData.top_products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{product.name || 'Unknown Product'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{product.total_sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FiShoppingCart className="mx-auto h-12 w-12 mb-4" />
              <p>No product sales data available</p>
            </div>
          )}
        </div>
      </div >
    </div >
  );
}

export default AdminDashboard;