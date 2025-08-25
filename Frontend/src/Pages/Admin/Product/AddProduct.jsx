import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    stock: '',
    discountPercentage: '',
    warranty: '', // Added warranty field
    specifications: [{ topic: '', value: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setProductData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSpecificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecifications = [...productData.specifications];
    updatedSpecifications[index][name] = value;
    setProductData(prev => ({
      ...prev,
      specifications: updatedSpecifications
    }));
  };

  const addSpecificationField = () => {
    setProductData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { topic: '', value: '' }]
    }));
  };

  const removeSpecificationField = (index) => {
    const updatedSpecifications = [...productData.specifications];
    updatedSpecifications.splice(index, 1);
    setProductData(prev => ({
      ...prev,
      specifications: updatedSpecifications
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error('Authentication required. Please login.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    if (productData.image) {
      formData.append('image', productData.image);
    }
    formData.append('stock', productData.stock);
    formData.append('discountPercentage', productData.discountPercentage);
    formData.append('warranty', productData.warranty);
    formData.append('specifications', JSON.stringify(productData.specifications));

    try {
      const response = await axios.post('/api/v1/product/addproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Product added successfully!');
      setProductData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        stock: '',
        discountPercentage: '',
        warranty: '',
        specifications: [{ topic: '', value: '' }]
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 shadow-xl rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-800 font-semibold">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={productData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
              />
            </div>

            {/* Price, Stock, and Warranty */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={productData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={productData.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                />
              </div>

              {/* Warranty Field */}
              <div>
                <label htmlFor="warranty" className="block text-sm font-medium text-gray-700">
                  Warranty (months)
                </label>
                <select
                  id="warranty"
                  name="warranty"
                  value={productData.warranty}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                >
                  <option value="">Select warranty</option>
                  <option value="0">No Warranty</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                </select>
              </div>

            </div>

            {/* Category and Discount */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium cursor-pointer text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home</option>
                  <option value="books">Books</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>

              <div>
                <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  min="0"
                  max="100"
                  value={productData.discountPercentage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mt-1 block w-full text-sm bg-blue-50 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              {productData.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-3">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      name="topic"
                      placeholder="Topic (e.g., Color)"
                      value={spec.topic}
                      onChange={(e) => handleSpecificationChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      name="value"
                      placeholder="Value (e.g., Red)"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center">
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={addSpecificationField}
                        className="inline-flex items-center cursor-pointer px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeSpecificationField(index)}
                        className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;