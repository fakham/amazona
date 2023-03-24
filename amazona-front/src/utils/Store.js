import React, { createContext, useReducer } from 'react';
import { CART_ACTIONS } from './reducer-actions';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.CART_ADD_ITEM:
      const newItem = action.payload;
      const exitsItem = state.cart.cartItems.find((x) => x._id === newItem._id);
      const cartItems = exitsItem
        ? state.cart.cartItems.map((item) =>
            item._id === exitsItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    case CART_ACTIONS.CART_REMOVE_ITEM:
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter(
            (item) => item._id !== action.payload._id
          ),
        },
      };
    default:
      return state;
  }
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
}
