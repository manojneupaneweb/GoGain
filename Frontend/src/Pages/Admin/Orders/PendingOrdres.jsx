import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <FiPackage className="mr-1" />,
    label: "Pending"
  },
  shipping: {
    color: "bg-blue-100 text-blue-800",
    icon: <FiTruck className="mr-1" />,
    label: "Shipping"
  },
  completed: {
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="mr-1" />,
    label: "Completed"
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: <FiX className="mr-1" />,
    label: "Cancelled"
  },
};

const actionOptions = [
  {
    status: "shipping",
    label: "Mark as Shipping",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: <FiTruck className="mr-1" />,
  },
  {
    status: "completed",
    label: "Complete Order",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: <FiCheck className="mr-1" />,
  },
  {
    status: "cancelled",
    label: "Cancel Order",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <FiX className="mr-1" />,
  },
];

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v1/cart/getorderitem`, {
        params: { page, limit },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setTotalPages(Math.ceil((response.data.total || 1) / limit));
        
        if (response.data.data.length === 0) {
          toast.info("No orders found");
        }
      } else {
        setOrders([]);
        toast.info("No orders data available");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const showConfirmation = (orderId, status) => {
    setCurrentOrder(orderId);
    setNewStatus(status);
    setShowConfirmModal(true);
  };

  const closeConfirmation = () => {
    setShowConfirmModal(false);
    setCurrentOrder(null);
    setNewStatus("");
    setProcessing(false);
  };

  const changeOrderStatus = async () => {
    setProcessing(true);
    try {
      await axios.post(
        '/api/v1/admin/changestatus',
        { 
          orderId: currentOrder,
          status: newStatus 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === currentOrder ? { ...order, order_status: newStatus } : order
      ));
      
      toast.success(`Order status changed to ${statusConfig[newStatus]?.label || newStatus}`);
      closeConfirmation();
    } catch (error) {
      console.error("Failed to change order status:", error);
      toast.error(error.response?.data?.message || "Failed to change order status");
      setProcessing(false);
    }
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
          <span className="text-lg font-medium text-gray-700">Loading orders...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-md max-w-md text-center"
        >
          <div className="text-red-500 mb-4">
            <FiX className="inline-block text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.order_status === "pending");

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Confirmation Modal */}
      <ToastContainer/>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change order #{currentOrder?.substring(0, 8)} status to{" "}
              <span className="font-semibold capitalize">
                {statusConfig[newStatus]?.label || newStatus}
              </span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmation}
                disabled={processing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={changeOrderStatus}
                disabled={processing}
                className={`px-4 py-2 rounded-md text-white ${
                  newStatus === "completed"
                    ? "bg-green-600 hover:bg-green-700"
                    : newStatus === "cancelled"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50 min-w-24 flex justify-center`}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pending Orders</h1>
          <p className="text-gray-600 mt-1">Manage orders awaiting processing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {pendingOrders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id?.substring(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.user_id?.substring(0, 8) || "Guest"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
                            statusConfig[order.order_status]?.color || "bg-gray-100 text-gray-800"
                          }`}>
                            {statusConfig[order.order_status]?.icon}
                            {statusConfig[order.order_status]?.label || order.order_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          {actionOptions.map((action) => (
                            <button
                              key={action.status}
                              onClick={() => showConfirmation(order.id, action.status)}
                              className={`px-2 py-1 text-xs rounded-md inline-flex items-center cursor-pointer ${action.color}`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, pendingOrders.length)}</span> of{" "}
                  <span className="font-medium">{pendingOrders.length}</span> pending orders
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
                      page >= totalPages ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } text-sm`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Pending Orders</h3>
              <p className="mt-1 text-sm text-gray-500">
                All orders are processed or there are no orders yet.
              </p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PendingOrders;