import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const STATUS_CONFIG = {
  shipping: {
    color: "bg-blue-100 text-blue-800",
    icon: <FiTruck className="mr-1" />,
    label: "Shipping",
  },
  delivered: {
    color: "bg-green-100 text-green-800",
    icon: <FiCheck className="mr-1" />,
    label: "Delivered",
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: <FiX className="mr-1" />,
    label: "Cancelled",
  },
};

const ACTION_OPTIONS = [
  {
    status: "delivered",
    label: "Mark as Delivered",
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

const CANCELLATION_REASONS = [
  "Out of stock",
  "Customer request",
  "Invalid address",
  "Suspicious activity",
  "Payment issue"
];

const ITEMS_PER_PAGE = 10;

// Helper functions
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count}${interval.label} ago`;
    }
  }
  return 'just now';
};

const LoadingSpinner = () => (
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

const ErrorDisplay = ({ error, onRetry }) => (
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
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto"
      >
        <FiRefreshCw className="mr-2" />
        Try Again
      </button>
    </motion.div>
  </div>
);

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  newStatus, 
  onConfirm, 
  processing 
}) => {
  if (!isOpen) return null;

  return (
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
          Are you sure you want to change order #{orderId?.substring(0, 8)} status to{" "}
          <span className="font-semibold capitalize">
            {STATUS_CONFIG[newStatus]?.label || newStatus}
          </span>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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
  );
};

const CancelModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  onConfirm, 
  processing,
  cancellationReasons 
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!cancelReason && !customReason) {
      toast.error("Please select or provide a cancellation reason");
      return;
    }
    if (cancelReason === "other" && !customReason) {
      toast.error("Please provide a cancellation reason");
      return;
    }
    
    const finalReason = cancelReason === "other" ? customReason : cancelReason;
    onConfirm(finalReason);
    
    // Reset form
    setCancelReason("");
    setCustomReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Cancel Order #{orderId?.substring(0, 8)}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select cancellation reason
          </label>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="text-black">Select a reason</option>
            {cancellationReasons.map((reason, index) => (
              <option key={index} value={reason} className="text-black">
                {reason}
              </option>
            ))}
            <option value="other" className="text-black">Other (specify below)</option>
          </select>
        </div>

        {cancelReason === "other" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please specify the reason
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              className="w-full p-2 text-black border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter cancellation reason"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 min-w-24 flex justify-center"
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelling
              </>
            ) : (
              "Confirm Cancel"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const OrderTable = ({ orders, onStatusChange, page, totalPages, onPageChange }) => {
  const ShippingOrders = orders.filter(order => order.order_status === "shipping");
  
  if (ShippingOrders.length === 0) {
    return (
      <div className="p-8 text-center">
        <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Shipping Orders</h3>
        <p className="mt-1 text-sm text-gray-500">
          All orders are processed or there are no orders yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
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
            {ShippingOrders.map((order, index) => (
              <OrderRow 
                key={order.id} 
                order={order} 
                index={index}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination 
        page={page}
        totalPages={totalPages}
        totalItems={ShippingOrders.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={onPageChange}
      />
    </>
  );
};

const OrderRow = ({ order, index, onStatusChange }) => (
  <motion.tr
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
    <td className="px-6 py-4 whitespace-nowrap flex">
      <img 
        src={order.product_image}
        className="w-10 h-10 rounded-md object-cover mr-2"
        alt={order.product_name} 
      />
      <div className="text-sm text-gray-900">
        {order.product_name?.substring(0, 8) || "N/A"}
        <br />
        Price: {order.product_price}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {order.quantity}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap flex">
      <img 
        src={order.avatar}
        className="w-10 h-10 rounded-md object-cover mr-2"
        alt={order.fullName} 
      />
      <div className="text-sm text-gray-900">
        {order.fullName?.substring(0, 8) || "N/A"}
        <br />
        Email: {order.email}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {order.total_price}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {new Date(order.created_at).toLocaleDateString()}
      </div>
      <div className="text-xs text-gray-500">
        {new Date(order.created_at).toLocaleTimeString()}
      </div>
      <div className="text-sm text-gray-900">
        {timeAgo(order.created_at)}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
        STATUS_CONFIG[order.order_status]?.color || "bg-gray-100 text-gray-800"
      }`}>
        {STATUS_CONFIG[order.order_status]?.icon}
        {STATUS_CONFIG[order.order_status]?.label || order.order_status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap space-x-2">
      {ACTION_OPTIONS.map((action) => (
        <button
          key={action.status}
          onClick={() => onStatusChange(order.id, action.status)}
          className={`px-2 py-1 text-xs rounded-md inline-flex items-center cursor-pointer ${action.color}`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </td>
  </motion.tr>
);

const Pagination = ({ page, totalPages, totalItems, itemsPerPage, onPageChange }) => (
  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
    <div className="text-sm text-gray-600">
      Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{" "}
      <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span> of{" "}
      <span className="font-medium">{totalItems}</span> Shipping orders
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-md ${
          page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white text-sm`}
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`px-3 py-1 rounded-md ${
          page >= totalPages ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
        } text-sm`}
      >
        Next
      </button>
    </div>
  </div>
);

const ShippingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/v1/admin/getallorders`, {
        params: { page, limit: ITEMS_PER_PAGE, status: 'shipping' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setTotalPages(Math.ceil((response.data.total || 1) / ITEMS_PER_PAGE));

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
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showConfirmation = (orderId, status) => {
    setCurrentOrder(orderId);
    setNewStatus(status);

    if (status === "cancelled") {
      setShowCancelModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmModal(false);
    setShowCancelModal(false);
    setCurrentOrder(null);
    setNewStatus("");
    setProcessing(false);
  };

  const changeOrderStatus = async (reason = "") => {
    setProcessing(true);
    
    try {
      const response = await axios.post(
        '/api/v1/admin/changestatus',
        {
          orderId: currentOrder,
          status: newStatus,
          cancelReason: reason
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      console.log('shipping order response:', response);

      // Update local state
      setOrders(orders.map(order =>
        order.id === currentOrder ? { ...order, order_status: newStatus } : order
      ));

      toast.success(`Order status changed to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      closeConfirmation();
    } catch (error) {
      console.error("Failed to change order status:", error);
      toast.error(error.response?.data?.message || "Failed to change order status");
      setProcessing(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchOrders} />;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <ToastContainer />
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmation}
        orderId={currentOrder}
        newStatus={newStatus}
        onConfirm={() => changeOrderStatus()}
        processing={processing}
      />
      
      <CancelModal
        isOpen={showCancelModal}
        onClose={closeConfirmation}
        orderId={currentOrder}
        onConfirm={changeOrderStatus}
        processing={processing}
        cancellationReasons={CANCELLATION_REASONS}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white-800">Shipping Orders</h1>
          <p className="text-white-600 mt-1">Manage orders awaiting processing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <OrderTable 
            orders={orders}
            onStatusChange={showConfirmation}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingOrders;