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
import { useNavigate } from 'react-router-dom';

function Cart() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [total, setTotal] = useState(0);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('esewa');
    const { cartItems, setCartItems, setCartCount } = useCart();
    const [disabled, setDisabled] = useState();
    const token = localStorage.getItem('accessToken');

    // Address form state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [localAddress, setLocalAddress] = useState('');
    const [savingAddress, setSavingAddress] = useState(false);

    const fetchCartItems = async () => {
        setDisabled(true);
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/cart/getcartitem', {
                headers: {
                    Authorization: `Bearer ${token}`
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

        const mockProvinces = [
            { id: 1, name: 'Province 1' },
            { id: 2, name: 'Madhesh' },
            { id: 3, name: 'Bagmati' },
            { id: 4, name: 'Gandaki' },
            { id: 5, name: 'Lumbini' },
            { id: 6, name: 'Karnali' },
            { id: 7, name: 'Sudurpashchim' }
        ];
        setProvinces(mockProvinces);

        const mockDistricts = [
            // Province 1
            { id: 1, name: 'Bhojpur', province_id: 1 },
            { id: 2, name: 'Dhankuta', province_id: 1 },
            { id: 3, name: 'Ilam', province_id: 1 },
            { id: 4, name: 'Jhapa', province_id: 1 },
            { id: 5, name: 'Khotang', province_id: 1 },
            { id: 6, name: 'Morang', province_id: 1 },
            { id: 7, name: 'Okhaldhunga', province_id: 1 },
            { id: 8, name: 'Panchthar', province_id: 1 },
            { id: 9, name: 'Sankhuwasabha', province_id: 1 },
            { id: 10, name: 'Solukhumbu', province_id: 1 },
            { id: 11, name: 'Sunsari', province_id: 1 },
            { id: 12, name: 'Taplejung', province_id: 1 },
            { id: 13, name: 'Terhathum', province_id: 1 },
            { id: 14, name: 'Udayapur', province_id: 1 },

            // Province 2 (Madhesh)
            { id: 15, name: 'Saptari', province_id: 2 },
            { id: 16, name: 'Siraha', province_id: 2 },
            { id: 17, name: 'Dhanusha', province_id: 2 },
            { id: 18, name: 'Mahottari', province_id: 2 },
            { id: 19, name: 'Bara', province_id: 2 },
            { id: 20, name: 'Parsa', province_id: 2 },
            { id: 21, name: 'Rautahat', province_id: 2 },
            { id: 22, name: 'Sarlahi', province_id: 2 },

            // Bagmati
            { id: 23, name: 'Bhaktapur', province_id: 3 },
            { id: 24, name: 'Chitwan', province_id: 3 },
            { id: 25, name: 'Dhading', province_id: 3 },
            { id: 26, name: 'Dolakha', province_id: 3 },
            { id: 27, name: 'Kathmandu', province_id: 3 },
            { id: 28, name: 'Kavrepalanchok', province_id: 3 },
            { id: 29, name: 'Lalitpur', province_id: 3 },
            { id: 30, name: 'Makwanpur', province_id: 3 },
            { id: 31, name: 'Ramechhap', province_id: 3 },
            { id: 32, name: 'Rasuwa', province_id: 3 },
            { id: 33, name: 'Sindhuli', province_id: 3 },
            { id: 34, name: 'Sindhupalchok', province_id: 3 },

            // Gandaki
            { id: 35, name: 'Baglung', province_id: 4 },
            { id: 36, name: 'Gorkha', province_id: 4 },
            { id: 37, name: 'Kaski', province_id: 4 },
            { id: 38, name: 'Lamjung', province_id: 4 },
            { id: 39, name: 'Manang', province_id: 4 },
            { id: 40, name: 'Mustang', province_id: 4 },
            { id: 41, name: 'Nawalpur', province_id: 4 },
            { id: 42, name: 'Parbat', province_id: 4 },
            { id: 43, name: 'Syangja', province_id: 4 },
            { id: 44, name: 'Tanahun', province_id: 4 },

            // Lumbini
            { id: 45, name: 'Arghakhanchi', province_id: 5 },
            { id: 46, name: 'Gulmi', province_id: 5 },
            { id: 47, name: 'Kapilvastu', province_id: 5 },
            { id: 48, name: 'Nawalparasi West', province_id: 5 },
            { id: 49, name: 'Palpa', province_id: 5 },
            { id: 50, name: 'Rupandehi', province_id: 5 },
            { id: 51, name: 'Dang', province_id: 5 },
            { id: 52, name: 'Pyuthan', province_id: 5 },
            { id: 53, name: 'Rolpa', province_id: 5 },
            { id: 54, name: 'Rukum West', province_id: 5 },
            { id: 55, name: 'Salyan', province_id: 5 },
            { id: 56, name: 'Dang', province_id: 5 },

            // Karnali
            { id: 57, name: 'Dailekh', province_id: 6 },
            { id: 58, name: 'Dolpa', province_id: 6 },
            { id: 59, name: 'Humla', province_id: 6 },
            { id: 60, name: 'Jajarkot', province_id: 6 },
            { id: 61, name: 'Jumla', province_id: 6 },
            { id: 62, name: 'Kalikot', province_id: 6 },
            { id: 63, name: 'Mugu', province_id: 6 },
            { id: 64, name: 'Rukum East', province_id: 6 },
            { id: 65, name: 'Salyan', province_id: 6 },

            // Sudurpashchim
            { id: 66, name: 'Bajhang', province_id: 7 },
            { id: 67, name: 'Bajura', province_id: 7 },
            { id: 68, name: 'Dadeldhura', province_id: 7 },
            { id: 69, name: 'Darchula', province_id: 7 },
            { id: 70, name: 'Achham', province_id: 7 },
            { id: 71, name: 'Baitadi', province_id: 7 },
            { id: 72, name: 'Kailali', province_id: 7 },
            { id: 73, name: 'Kanchanpur', province_id: 7 },
            { id: 74, name: 'Doti', province_id: 7 },
            { id: 75, name: 'Dadeldhura', province_id: 7 },
            { id: 76, name: 'Bajhang', province_id: 7 },
            { id: 77, name: 'Bajura', province_id: 7 },
        ];

        setDistricts(mockDistricts);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = districts.filter(district =>
                district.province_id === parseInt(selectedProvince)
            );
            setDistricts(filteredDistricts);
            setSelectedDistrict('');
        }
    }, [selectedProvince]);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProvince || !selectedDistrict || !localAddress) {
            toast.error('Please fill all address fields');
            return;
        }

        setSavingAddress(true);

        try {
            const provinceName = provinces.find(p => p.id === parseInt(selectedProvince))?.name;
            const districtName = districts.find(d => d.id === parseInt(selectedDistrict))?.name;
            const fullAddress = `${provinceName}, ${districtName}, ${localAddress}`;

            await axios.post('/api/v1/user/deliveryaddress',
                { address: fullAddress },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setShowAddressPopup(false);
            setShowPaymentPopup(true);
            toast.success('Address saved successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving address');
            console.error('Save address error:', error);
        } finally {
            setSavingAddress(false);
        }
    };

    const handleCheckoutClick = () => {
        setShowAddressPopup(true);
    };

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
                {/* Address Popup */}
                {showAddressPopup && (
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
                            <div className="flex justify-between items-center border-b border-gray-100 p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
                                <button
                                    onClick={() => setShowAddressPopup(false)}
                                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Close address popup"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddressSubmit} className="p-5">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                                            Province
                                        </label>
                                        <select
                                            id="province"
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Province</option>
                                            {provinces.map(province => (
                                                <option key={province.id} value={province.id}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                            District
                                        </label>
                                        <select
                                            id="district"
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(district => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="localAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                            Local Address
                                        </label>
                                        <input
                                            type="text"
                                            id="localAddress"
                                            value={localAddress}
                                            onChange={(e) => setLocalAddress(e.target.value)}
                                            placeholder="e.g., Kawasoti-2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={savingAddress}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    >
                                        {savingAddress ? 'Saving Address...' : 'Save Address & Continue to Payment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

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
                                        className={`flex-1 cursor-pointer py-3 px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'esewa'
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
                                        className={`flex-1 cursor-pointer  py-3 px-4 font-medium text-sm uppercase tracking-wide transition-colors duration-200 ${activeTab === 'khalti'
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
                                    {activeTab === 'esewa' && (
                                        <>
                                            {disabled ? (
                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                                                    <h4 className="font-medium text-gray-800 mb-2">Payment Unavailable</h4>
                                                    <p className="text-gray-600 text-sm mb-4">
                                                        eSewa payment is currently unavailable due to eSewa system issues. Please try again later or choose another payment method.
                                                    </p>

                                                    <button
                                                        onClick={() => setShowPaymentPopup(false)}
                                                        className="w-full mt-10 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-700"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                                                        <h4 className="font-medium text-orange-800 mb-2">Test Credentials</h4>
                                                        <ul className="text-sm text-gray-600 space-y-1">
                                                            <li className="flex items-start">
                                                                <span className="text-orange-500 mr-2">•</span>
                                                                ID: <span className="font-mono">9806800001-5</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="text-orange-500 mr-2">•</span>
                                                                Password: <span className="font-mono">Nepal@123</span>
                                                            </li>
                                                            <li className="flex items-start">
                                                                <span className="text-orange-500 mr-2">•</span>
                                                                MPIN: <span className="font-mono">1122</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className="text-gray-500 text-sm mb-4">
                                                            You'll be redirected to eSewa to complete your payment of{' '}
                                                            <span className="font-bold text-gray-700">रु. {total}</span>
                                                        </p>
                                                        <button
                                                            onClick={() => handleEsewaClick(total)}
                                                            disabled={true} // button disabled
                                                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                        >
                                                            <FaLock className="text-sm" />
                                                            Pay with eSewa
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'khalti' && (
                                        <div>
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                                <h4 className="font-medium text-purple-800 mb-2">Test Credentials</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        Mobile: <span className="font-mono">9800000000-9800000005</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        MPIN: <span className="font-mono">1111</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="text-purple-500 mr-2">•</span>
                                                        OTP: <span className="font-mono">987654</span>
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
                                                    className="w-full cursor-pointer  bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <FaShieldAlt className="text-sm" />
                                                    Pay with Khalti
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Security Notice */}
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
                        <a href="/product"
                            className="inline-flex items-center my-5 cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Continue Shopping
                        </a>

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
                                        onClick={handleCheckoutClick}
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