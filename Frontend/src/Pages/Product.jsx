import React, { useState, useEffect } from 'react';

function ProductListing() {
  // Sample gym products data
  const gymProducts = [
    { id: 1, name: 'Protein Powder', price: 2499, category: 'supplements', rating: 4.5 },
    { id: 2, name: 'Adjustable Dumbbells', price: 5999, category: 'equipment', rating: 4.8 },
    { id: 3, name: 'Yoga Mat', price: 1299, category: 'accessories', rating: 4.2 },
    { id: 4, name: 'Resistance Bands Set', price: 899, category: 'equipment', rating: 4.3 },
    { id: 5, name: 'Pre-Workout Supplement', price: 1599, category: 'supplements', rating: 4.1 },
    { id: 6, name: 'Foam Roller', price: 699, category: 'accessories', rating: 3.9 },
    { id: 7, name: 'Weightlifting Belt', price: 1899, category: 'equipment', rating: 4.4 },
    { id: 8, name: 'BCAA Powder', price: 1799, category: 'supplements', rating: 4.0 },
    { id: 9, name: 'Jump Rope', price: 499, category: 'accessories', rating: 4.6 },
    { id: 10, name: 'Kettlebell (10kg)', price: 1499, category: 'equipment', rating: 4.7 },
    { id: 11, name: 'Creatine Monohydrate', price: 999, category: 'supplements', rating: 4.9 },
    { id: 12, name: 'Gym Gloves', price: 799, category: 'accessories', rating: 3.8 },
    { id: 13, name: 'Barbell Set', price: 8999, category: 'equipment', rating: 4.8 },
    { id: 14, name: 'Mass Gainer', price: 2999, category: 'supplements', rating: 4.2 },
    { id: 15, name: 'Water Bottle', price: 399, category: 'accessories', rating: 4.0 },
    { id: 16, name: 'Bench Press', price: 12999, category: 'equipment', rating: 4.7 },
    { id: 17, name: 'Multivitamin', price: 1199, category: 'supplements', rating: 4.3 },
    { id: 18, name: 'Gym Bag', price: 1499, category: 'accessories', rating: 4.1 },
    { id: 19, name: 'Pull-Up Bar', price: 1999, category: 'equipment', rating: 4.5 },
    { id: 20, name: 'Whey Protein Isolate', price: 3499, category: 'supplements', rating: 4.8 }
  ];

  // State management
  const [products, setProducts] = useState(gymProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [sortOption, setSortOption] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Sorting functions
  const sortProducts = (option) => {
    let sortedProducts = [...products];
    switch (option) {
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting (original order)
        sortedProducts = [...gymProducts];
    }
    setProducts(sortedProducts);
    setCurrentPage(1); // Reset to first page after sorting
  };

  // Filtering function
  const filterProducts = (category) => {
    if (category === 'all') {
      setProducts(gymProducts);
    } else {
      const filtered = gymProducts.filter(product => product.category === category);
      setProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    sortProducts(option);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    filterProducts(category);
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Gym Equipment & Supplements</h1>
          <p className="mt-2 text-lg text-gray-600">Shop the best fitness products</p>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category:
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={handleCategoryChange}
                className="block w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-10 text-base"
              >
                <option value="all">All Categories</option>
                <option value="equipment">Equipment</option>
                <option value="supplements">Supplements</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By:
              </label>
              <select
                id="sort-by"
                value={sortOption}
                onChange={handleSortChange}
                className="block w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-10 text-base"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Rating (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentItems.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 text-sm ml-1">({product.rating})</span>
                </div>
                <p className="text-lg font-bold text-indigo-600">रु. {product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">{product.category}</p>
                <button className="mt-4 w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 cursor-pointer rounded-l-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 cursor-pointer border-t border-b border-gray-300 ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 cursor-pointer rounded-r-md border border-gray-300 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListing;