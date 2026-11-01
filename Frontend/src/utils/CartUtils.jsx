import api from './api';
import { toast } from 'react-toastify';

const addToCart = async (product, cartItems, setCartItems, setCartCount) => {
  if (!product?.id) {
    toast.error('Invalid product.');
    return;
  }

  
  try {
    // Call backend to add product
    const res = await api.post('/api/v1/cart/addtocart', {
      product_id: product.id,
      quantity: 1,
      price: product.price,
    }, {
      headers: {
      },
      withCredentials: true
    });

    // Show success toast
    toast.success(res?.data?.message || 'Added to cart.');

    // Update context locally
    const existingItem = cartItems.find(item => item.product_id === product.id);
    let updatedItems;
    if (existingItem) {
      updatedItems = cartItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedItems);
    setCartCount(updatedItems.length);

    return res.data;

  } catch (error) {
    console.error('Add to cart error:', error.response.data.message
    );
    toast.error(error.response.data.message || 'Failed to add item to cart. Please try again.');
  }

};

export default addToCart;
