import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiHome, FiCalendar, FiClock, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/admin/getalluserinformation', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      

      if (response.data && Array.isArray(response.data.data)) {
        setCustomers(response.data.data);
        setTotalPages(Math.ceil((response.data.total || 1) / limit));
      } else {
        setCustomers([]);
        toast.info("No customers data available");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-lg font-medium text-gray-700">Loading customers...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-md max-w-md text-center"
        >
          <div className="text-red-500 mb-4">
            <FiX className="inline-block text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading customers</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage all registered customers</p>
          <p className='text-black text-sm'>Total {customers.length} costumers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {customers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer, index) => (
                      <motion.tr
                        key={customer._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {customer.avatar ? (
                                <img className="h-10 w-10 rounded-full" src={customer.avatar} alt={customer.fullName} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FiUser className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.fullName || 'N/A'}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FiCalendar className="mr-1" />
                                {formatDate(customer.date_of_birth)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FiMail className="mr-1" />
                            {customer.email || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiPhone className="mr-1" />
                            {customer.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FiHome className="mr-1" />
                            {customer.address || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiClock className="mr-1" />
                            Joined: {formatDateTime(customer.created_at)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiLogIn className="mr-1" />
                            Last login: {formatDateTime(customer.last_login) || 'Never'}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, customers.length)}</span> of{" "}
                  <span className="font-medium">{customers.length}</span> customers
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded-md ${
                      page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white text-sm`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
                    disabled={page >= totalPages}
                    className={`px-3 py-1 rounded-md ${
                      page >= totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white text-sm`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FiUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Customers Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no customers registered.
              </p>
              <button
                onClick={fetchCustomers}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
              >
                Refresh
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Customers;