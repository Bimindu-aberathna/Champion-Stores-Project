import React, { createContext, useState, useEffect } from 'react';
import { cartServiceEndpoint } from "../apiCalls";
import axios from 'axios';

// Create a context with default values
const CartContext = createContext({
  cartSize: 0,
  updateCartSize: () => {}
});

export const CartProvider = ({ children }) => {
  const [cartSize, setCartSize] = useState(0);

  const updateCartSize = async () => {
    if (!localStorage.getItem('accessToken')) {
      return;
    }
    try {
      const response = await axios.get(cartServiceEndpoint + '/cartSize', {
        headers: {
          'x-access-token': localStorage.getItem('accessToken')
        }
      });
      if (response.status === 200) {
        setCartSize(response.data.size);
      }
    } catch (error) {
      console.error('Error fetching cart size', error);
    }
  };

  useEffect(() => {
    updateCartSize();
  }, []);

  return (
    <CartContext.Provider value={{ cartSize, updateCartSize }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
