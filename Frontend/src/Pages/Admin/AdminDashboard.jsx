import React from 'react';
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
import { FiUsers, FiShoppingCart, FiDollarSign, FiActivity } from 'react-icons/fi';

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
  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Sales 2022',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 3000, 5000, 2000, 3000, 45000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const customerData = {
    labels: ['New', 'Returning', 'Inactive'],
    datasets: [
      {
        data: [300, 150, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Stats cards data
  const stats = [
    { title: 'Total Users', value: '2,453', icon: <FiUsers size={24} />, change: '+12%', trend: 'up' },
    { title: 'Total Sales', value: '$34,543', icon: <FiShoppingCart size={24} />, change: '+8%', trend: 'up' },
    { title: 'Revenue', value: '$45,231', icon: <FiDollarSign size={24} />, change: '+23%', trend: 'up' },
    { title: 'Active Products', value: '342', icon: <FiActivity size={24} />, change: '-3%', trend: 'down' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Sales Comparison</h2>
          <Bar 
            data={salesData} 
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
              scales: {
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f3f4f6'
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f3f4f6'
                  }
                }
              }
            }}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Revenue Trend</h2>
          <Line 
            data={revenueData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#f3f4f6'
                  }
                },
              },
              scales: {
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f3f4f6'
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f3f4f6'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Customer Distribution</h2>
          <div className="h-64">
            <Pie 
              data={customerData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#f3f4f6'
                    }
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  { id: '#ORD-0001', customer: 'John Doe', status: 'Completed', amount: '$120.00' },
                  { id: '#ORD-0002', customer: 'Jane Smith', status: 'Processing', amount: '$85.50' },
                  { id: '#ORD-0003', customer: 'Robert Johnson', status: 'Shipped', amount: '$230.75' },
                  { id: '#ORD-0004', customer: 'Emily Davis', status: 'Pending', amount: '$65.99' },
                  { id: '#ORD-0005', customer: 'Michael Wilson', status: 'Completed', amount: '$154.20' },
                ].map((order, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-400">{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-900 text-green-300' :
                        order.status === 'Processing' ? 'bg-yellow-900 text-yellow-300' :
                        order.status === 'Shipped' ? 'bg-blue-900 text-blue-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;