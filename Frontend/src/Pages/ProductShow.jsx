import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../Component/Loading';

function ProductShow() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/product/${id}`);
            setProduct(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (value) => {
        const newValue = Math.max(1, Math.min(product.stock, quantity + value));
        setQuantity(newValue);
    };

    if (loading) {
       <Loading/>
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-red-500 max-w-md p-6 bg-white rounded-lg shadow">
                    <p className="text-xl font-semibold">Error loading product</p>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <button
                        onClick={fetchProduct}
                        className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
                    <p className="text-lg text-gray-600">Product not found</p>
                    <a
                        href="/"
                        className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    const specifications = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications || [];

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <a href="/" className="hover:text-indigo-600">Home</a> &gt; <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                <div className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Product Image */}
                        <div className="p-6 md:p-8">
                            <div className="relative h-96 bg-gray-50 rounded-lg flex items-center justify-center p-4 border border-gray-200 group overflow-hidden">
                                {product.tag && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                        {product.tag}
                                    </span>
                                )}
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-gray-400">No image available</span>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6 md:p-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-gray-600 text-sm ml-2">({product.reviews || 0} reviews)</span>
                                </div>
                                <div>
                                    {product.stock > 0 ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            In Stock ({product.stock})
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {product.discount && parseFloat(product.discount) > 0 ? (
                                    <div className="flex items-center">
                                        <span className="text-3xl font-bold text-indigo-600">
                                            रु. {(product.price - (product.price * parseFloat(product.discount) / 100)).toLocaleString()}
                                        </span>
                                        <span className="ml-3 line-through text-gray-500">
                                            रु. {product.price.toLocaleString()}
                                        </span>
                                        <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                                            {product.discount}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-indigo-600">
                                        रु. {product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Category & Warranty */}
                            <div className="mb-6 grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Category:</span>
                                    <span className="ml-2 text-sm text-gray-600 capitalize">{product.category}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Warranty:</span>
                                    <span className="ml-2 text-sm text-gray-600">{product.warranty || 'No warranty'} months</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600">{product.description || 'No description available.'}</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-l-md flex items-center justify-center"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <div className="bg-gray-100 text-center w-16 h-10 flex items-center justify-center">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-r-md flex items-center justify-center"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4">
                                <button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md transition duration-300"
                                    disabled={product.stock <= 0}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-md transition duration-300"
                                    disabled={product.stock <= 0}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    {specifications.length > 0 && (
                        <div className="border-t border-gray-200 p-6 md:p-8 bg-white shadow-sm rounded-xl mt-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {specifications.map((spec, index) => (
                                    <div key={index} className="flex flex-col bg-gray-50 p-5 rounded-lg shadow hover:shadow-md transition duration-300">
                                        <span className="text-sm text-gray-500 uppercase tracking-wider">{spec.topic}</span>
                                        <span className="text-base font-medium text-gray-700 mt-1">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductShow;
