export const FETCH_ACTIONS = {
  FETCH_REQUEST: 'fetch-request',
  FETCH_SUCCESS: 'fetch-success',
  FETCH_FAIL: 'fetch-fail',
};

export const CART_ACTIONS = {
  CART_ADD_ITEM: 'cart-add-item',
  CART_REMOVE_ITEM: 'cart-remove-item',
  CART_SAVE_SHIPPING_ADDRESS: 'cart-save-shipping-address',
  CART_SAVE_PAYMENT_METHOD: 'cart-save-payment-method',
  CART_CLEAR: 'cart-clear',
};

export const USER_ACTIONS = {
  USER_SIGNIN: 'user-signin',
  USER_SIGNOUT: 'user-signout',
};

export const ORDER_ACTIONS = {
  PAY_REQUEST: 'pay-request',
  PAY_SUCCESS: 'pay-success',
  PAY_FAIL: 'pay-fail',
  PAY_RESET: 'pay-reset',
};
