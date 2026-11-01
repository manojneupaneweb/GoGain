// CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart when app loads
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/v1/cart/getcartitem",
          {
            headers: {
            },
            withCredentials: true,
          }
        );
        const items = res.data?.data?.items || [];
        
        setCartItems(items);
        setCartCount(items.length); 
      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
