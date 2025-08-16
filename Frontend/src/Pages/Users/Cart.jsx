import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes, FaLock, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, redirect } from 'react-router-dom';
import Loading from '../../Component/Loading';
import { initiateEsewaPayment, initiateKhaltiPayment } from '../../utils/payment';
import { useCart } from '../../utils/CartContext';

function Cart() {
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [total, setTotal] = useState(0);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('esewa');
    const { cartItems, setCartItems, setCartCount } = useCart();

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/cart/getcartitem', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                withCredentials: true
            });

            const items = Array.isArray(response.data?.data?.items)
                ? response.data.data.items.map(item => ({
                    ...item,
                    quantity: Number(item.quantity) || 1,
                    price: parseFloat(item.price) || 0
                }))
                : [];

            setCartItems(items);
            calculateTotals(items);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching cart items');
            console.error('Fetch cart error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (items) => {
        const calculatedSubtotal = items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
        const calculatedShipping = calculatedSubtotal > 100 ? 0 : 10;
        setSubtotal(calculatedSubtotal);
        setShipping(calculatedShipping);
        setTotal(calculatedSubtotal + calculatedShipping);
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const updatedItems = cartItems.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);
            calculateTotals(updatedItems);

            const token = localStorage.getItem('accessToken');
            await axios.put(
                `/api/v1/cart/${productId}`,
                { quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
        } catch (error) {
            fetchCartItems();
            toast.error(error.response?.data?.message || 'Error updating cart');
            console.error('Update quantity error:', error);
        }
    };

    const removeItem = async (productId) => {
        if (!productId) {
            console.error('No product ID provided for removal');
            return;
        }

        try {
            // Optimistically update UI first
            const updatedItems = cartItems.filter(item => item.product_id !== productId);
            setCartItems(updatedItems);
            setCartCount(updatedItems.length);
            calculateTotals(updatedItems);

            // Call backend to delete
            const token = localStorage.getItem('accessToken');
            await axios.delete(`/api/v1/cart/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
        } catch (error) {
            // Revert changes if delete fails
            fetchCartItems();
            toast.error(error.response?.data?.message || 'Error removing item');
            console.error('Remove item error:', error);
        }
    };


    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleEsewaClick = (amount) => {
        if (!amount || isNaN(amount)) {
            toast.error('Invalid payment amount');
            return;
        }
        initiateEsewaPayment(amount, 2736);

        setShowPaymentPopup(false);
        redirect('/paymentsuccess');
    };

    const handleKhaltiClick = (amount) => {
        if (!amount || isNaN(amount)) {
            toast.error('Invalid payment amount');
            return;
        }
        initiateKhaltiPayment(amount, 5678);
        setShowPaymentPopup(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-7xl mx-auto">
                {/* Payment Popup */}
                {showPaymentPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                        >
                            <div className="flex justify-between items-center border-b border-gray-100 p-5 bg-gradient-to-r from-orange-50 to-amber-50">
                                <h3 className="text-xl font-semibold text-gray-800">Complete Your Payment</h3>
                                <button
                                    onClick={() => setShowPaymentPopup(false)}
                                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Close payment popup"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5">
                                <div className="flex border-b border-gray-100">
                                    <button
                                        className={`flex-1 py-3 px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'esewa'
                                            ? 'text-orange-600 border-b-2 border-orange-600 font-semibold'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        onClick={() => setActiveTab('esewa')}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <img
                                                src="https://www.drupal.org/files/project-images/esewa.png"
                                                alt="eSewa"
                                                className="h-10"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150x60?text=eSewa';
                                                }}
                                            />
                                        </span>
                                    </button>
                                    <button
                                        className={`flex-1 py-3 px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'khalti'
                                            ? 'text-purple-600 border-b-2 border-purple-600 font-semibold'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        onClick={() => setActiveTab('khalti')}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <img
                                                src="https://cdn.selldone.com/app/contents/community/posts/images/CleanShot20221017at1413242xpng46cc84efd2abd15fcbd79171f835be14.png"
                                                alt="Khalti"
                                                className="h-5"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150x60?text=Khalti';
                                                }}
                                            />
                                        </span>
                                    </button>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {activeTab === 'esewa' ? (
                                        <>
                                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                                                <h4 className="font-medium text-orange-800 mb-2">Test Credentials</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li className="flex items-start">
                                                        <span className="text-orange-500 mr-2">•</span>
                                                        <span>ID: <span className="font-mono">9806800001-5</span></span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-orange-500 mr-2">•</span>
                                                        <span>Password: <span className="font-mono">Nepal@123</span></span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-orange-500 mr-2">•</span>
                                                        <span>MPIN: <span className="font-mono">1122</span></span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-gray-500 text-sm mb-4">
                                                    You'll be redirected to eSewa to complete your payment of
                                                    <span className="font-bold text-gray-700"> रु. {total}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleEsewaClick(total)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <FaLock className="text-sm" />
                                                    Pay with eSewa
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                                <h4 className="font-medium text-purple-800 mb-2">Test Credentials</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        <span>Mobile: <span className="font-mono">9800000000-9800000005</span></span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        <span>MPIN: <span className="font-mono">1111</span></span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        <span>OTP: <span className="font-mono">987654</span></span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-gray-500 text-sm mb-4">
                                                    You'll be redirected to Khalti to complete your payment of
                                                    <span className="font-bold text-gray-700"> रु. {total}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleKhaltiClick(total)}
                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <FaShieldAlt className="text-sm" />
                                                    Pay with Khalti
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 text-center">
                                        Your payment is secured with end-to-end encryption
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Your Shopping Cart
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Review and checkout your items
                    </p>
                </motion.div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center py-16"
                    >
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-2 text-gray-500">
                            Start adding some products to your cart!
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/product"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <motion.li
                                            key={item.product_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-24 w-24 rounded-md object-cover"
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="text-lg font-medium text-gray-900">
                                                                {item.name || 'Product Name'}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {item.category || 'Category'}
                                                            </p>
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-900">
                                                            रु. {(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                                className="p-1 rounded-md cursor-pointer text-gray-400 hover:text-orange-500 hover:bg-gray-100"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <FaMinus className="h-4 w-4" />
                                                            </button>
                                                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                                className="p-1 rounded-md text-gray-400 cursor-pointer hover:text-orange-500 hover:bg-gray-100"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <FaPlus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.product_id)}
                                                            className="text-red-500 cursor-pointer hover:text-red-700"
                                                            aria-label="Remove item"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white shadow overflow-hidden sm:rounded-lg p-6 h-fit sticky top-6"
                            >
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">रु. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">रु. {shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-lg font-bold">रु. {total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowPaymentPopup(true)}
                                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <Link
                                        to="/product"
                                        className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;