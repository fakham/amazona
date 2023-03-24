import React, { createContext, useReducer } from 'react';
import { CART_ACTIONS } from './reducer-actions';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
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
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
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
