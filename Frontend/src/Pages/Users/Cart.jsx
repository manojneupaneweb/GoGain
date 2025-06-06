import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../utils/CartContext';



function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchCartItems = async () => {
        try {
            const { cartItems } = useCart();

            if (response.data.success) {
                setCartItems(response.data.cartItems);
                calculateTotals(response.data.cartItems);
            } else {
                toast.error('Failed to fetch cart items');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching cart items');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (items) => {
        const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const calculatedShipping = calculatedSubtotal > 100 ? 0 : 10; // Free shipping over $100
        const calculatedTax = calculatedSubtotal * 0.1; // 10% tax

        setSubtotal(calculatedSubtotal);
        setShipping(calculatedShipping);
        setTax(calculatedTax);
        setTotal(calculatedSubtotal + calculatedShipping + calculatedTax);
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(
                `/api/v1/product/cart/${productId}`,
                { quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                const updatedItems = cartItems.map(item =>
                    item.product._id === productId ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(updatedItems);
                calculateTotals(updatedItems);
                toast.success('Cart updated');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating cart');
        }
    };

    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(`/api/v1/product/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (response.data.success) {
                const updatedItems = cartItems.filter(item => item.product._id !== productId);
                setCartItems(updatedItems);
                calculateTotals(updatedItems);
                toast.success('Item removed from cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error removing item');
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-7xl mx-auto">
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
                                            key={item.product._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-24 w-24 rounded-md object-cover"
                                                        src={item.product.images[0]?.url || 'https://via.placeholder.com/150'}
                                                        alt={item.product.name}
                                                    />
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="text-lg font-medium text-gray-900">
                                                                {item.product.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {item.product.category}
                                                            </p>
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                                className="p-1 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-100"
                                                            >
                                                                <FaMinus className="h-4 w-4" />
                                                            </button>
                                                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                                className="p-1 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-100"
                                                            >
                                                                <FaPlus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.product._id)}
                                                            className="text-red-500 hover:text-red-700"
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
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-lg font-bold">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button
                                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <Link
                                        to="/products"
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