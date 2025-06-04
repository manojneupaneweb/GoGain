import React, { useState, useEffect } from 'react';

function MyProduct() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchOrders = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dummy data
        const dummyOrders = [
          {
            _id: '1',
            orderNumber: 'ORD-2023-001',
            createdAt: '2023-06-15T10:30:00Z',
            status: 'Delivered',
            items: [
              {
                _id: '101',
                product: {
                  name: 'Premium Protein Powder',
                  price: 2499,
                  image: 'https://m.media-amazon.com/images/I/61uG+N+UYEL._SL1500_.jpg'
                },
                quantity: 2,
                size: '2kg',
                color: 'Chocolate'
              },
              {
                _id: '102',
                product: {
                  name: 'Adjustable Dumbbells',
                  price: 5999,
                  image: 'https://m.media-amazon.com/images/I/71YHjVXyR0L._SL1500_.jpg'
                },
                quantity: 1
              }
            ],
            shippingAddress: {
              addressLine1: '123 Fitness Street',
              addressLine2: 'Apt 4B',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
              country: 'India'
            },
            paymentMethod: 'Credit Card',
            paymentStatus: 'Paid',
            totalAmount: 10997
          },
          {
            _id: '2',
            orderNumber: 'ORD-2023-002',
            createdAt: '2023-06-20T14:45:00Z',
            status: 'Shipped',
            items: [
              {
                _id: '201',
                product: {
                  name: 'Yoga Mat',
                  price: 1299,
                  image: 'https://m.media-amazon.com/images/I/71iQnK+WOoL._SL1500_.jpg'
                },
                quantity: 1,
                color: 'Purple'
              }
            ],
            shippingAddress: {
              addressLine1: '456 Wellness Road',
              city: 'Bangalore',
              state: 'Karnataka',
              postalCode: '560001',
              country: 'India'
            },
            paymentMethod: 'UPI',
            paymentStatus: 'Paid',
            totalAmount: 1299
          },
          {
            _id: '3',
            orderNumber: 'ORD-2023-003',
            createdAt: '2023-06-25T09:15:00Z',
            status: 'Pending',
            items: [
              {
                _id: '301',
                product: {
                  name: 'Resistance Bands Set',
                  price: 899,
                  image: 'https://m.media-amazon.com/images/I/71n3DYZE5VL._SL1500_.jpg'
                },
                quantity: 1
              },
              {
                _id: '302',
                product: {
                  name: 'Foam Roller',
                  price: 699,
                  image: 'https://m.media-amazon.com/images/I/61YvF0kqO5L._SL1500_.jpg'
                },
                quantity: 1
              }
            ],
            shippingAddress: {
              addressLine1: '789 Gym Lane',
              addressLine2: 'Floor 3',
              city: 'Delhi',
              state: 'Delhi',
              postalCode: '110001',
              country: 'India'
            },
            paymentMethod: 'Debit Card',
            paymentStatus: 'Processing',
            totalAmount: 1598
          }
        ];

        setOrders(dummyOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: 'Cancelled' } : order
    ));
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Purchases</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all your purchased products
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No purchases yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't purchased any products yet. Start shopping now!
            </p>
            <div className="mt-6">
              <a
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Products
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id}>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Products</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <li key={item._id} className="py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-16 w-16">
                                    <img
                                      className="h-16 w-16 rounded-md object-cover"
                                      src={item.product.image}
                                      alt={item.product.name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {item.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {item.quantity} × ₹{item.product.price}
                                    </p>
                                    {item.size && (
                                      <p className="text-sm text-gray-500">
                                        Size: {item.size} {item.color && `| Color: ${item.color}`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Shipping address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {order.shippingAddress.addressLine1}<br />
                          {order.shippingAddress.addressLine2 && (
                            <>{order.shippingAddress.addressLine2}<br /></>
                          )}
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Payment method</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {order.paymentMethod} • {order.paymentStatus}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Order total</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          ₹{order.totalAmount.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-4 bg-gray-50 flex justify-end space-x-3">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                      Track Order
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                      View Invoice
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProduct;