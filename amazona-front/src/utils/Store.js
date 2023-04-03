import React, { createContext, useReducer } from 'react';
import { CART_ACTIONS, USER_ACTIONS } from './reducer-actions';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
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
    case CART_ACTIONS.CART_CLEAR:
      localStorage.removeItem('cartItems');
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case CART_ACTIONS.CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case CART_ACTIONS.CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case USER_ACTIONS.USER_SIGNIN:
      return {
        ...state,
        userInfo: action.payload,
      };
    case USER_ACTIONS.USER_SIGNOUT:
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
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
