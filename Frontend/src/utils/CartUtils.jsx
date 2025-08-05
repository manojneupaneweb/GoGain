import axios from 'axios';
import { toast } from 'react-toastify';

const addToCart = async (product, user_id = 1, setCartCount) => {

  const token = localStorage.getItem('accessToken');
  if (!token) {
    toast.error('You must be logged in to add items to the cart.');
    return;
  }
  const res = await axios.post('api/v1/product/addtocart', {
    user_id,
    product_id: product.id,
    quantity: 1,
  });
  toast.success(res.data.message);
  
  if (setCartCount) {
    setCartCount(prev => prev + 1);
  }

  return res.data;
};

export default addToCart;
