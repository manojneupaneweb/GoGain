import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

function UpdateProduct() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    stock: '',
    discount: '',
    warranty: '',
    specifications: [{ topic: '', value: '' }]
  });
  const [imagePreview, setImagePreview] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/product/${id}`);
      const product = response.data.data;
      console.log('Fetched product:', product.image);
      
      
      // Parse specifications if they're stored as string
      const specs = typeof product.specifications === 'string' 
        ? JSON.parse(product.specifications) 
        : product.specifications || [{ topic: '', value: '' }];

      setProductData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        image: null, // We'll keep this null to handle image updates separately
        stock: product.stock || '',
        discount: product.discount || '',
        warranty: product.warranty || '',
        specifications: specs
      });

      if (product.image) {
        setImagePreview(product.image);
      }

      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch product');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    if (productData.specifications.length <= 1) return;
    
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
    formData.append('discount', productData.discount);
    formData.append('warranty', productData.warranty);
    formData.append('specifications', JSON.stringify(productData.specifications));

    try {
      const response = await axios.put(`/api/v1/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Product updated successfully!');
      // Refresh the product data after successful update
      fetchProduct();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !productData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Update Product</h1>
            <p className="text-blue-100">ID: {id}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-black font-semibold">
            {/* Image Preview and Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="h-24 w-24 object-cover rounded-md border border-gray-300"
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a new image to replace the current one
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home</option>
                  <option value="books">Books</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={productData.price}
                    onChange={handleChange}
                    required
                    className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="0"
                    max="100"
                    value={productData.discount}
                    onChange={handleChange}
                    className="block w-full pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={productData.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              {/* Warranty */}
              <div>
                <label htmlFor="warranty" className="block text-sm font-medium text-gray-700">
                  Warranty
                </label>
                <select
                  id="warranty"
                  name="warranty"
                  value={productData.warranty}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="">No Warranty</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={productData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            {/* Specifications */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Specifications
                </label>
                <button
                  type="button"
                  onClick={addSpecificationField}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Specification
                </button>
              </div>
              
              {productData.specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      name="topic"
                      placeholder="Specification name"
                      value={spec.topic}
                      onChange={(e) => handleSpecificationChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      name="value"
                      placeholder="Specification value"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, e)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    {productData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecificationField(index)}
                        className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;