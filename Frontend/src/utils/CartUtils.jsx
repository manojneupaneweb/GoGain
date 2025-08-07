import axios from 'axios';
import { toast } from 'react-toastify';

const addToCart = async (product, setCartCount) => {
  if (!product?.id) {
    toast.error('Invalid product.');
    return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    toast.error('Please log in to add items to your cart.');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');

    const res = await axios.post('/api/v1/cart/addtocart', {
      product_id: product.id,
      quantity: 1,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res?.data?.message) {
      toast.success(res.data.message);
    } else {
      toast.success('Added to cart.');
    }

    if (typeof setCartCount === 'function') {
      setCartCount(prev => prev + 1);
    }

    return res.data;

  } catch (error) {
    console.error('Add to cart error:', error);
    const errMsg = error.response?.data?.message || 'Failed to add item to cart.';
    toast.error(errMsg);
  }
};

export default addToCart;
