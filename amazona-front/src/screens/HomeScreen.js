import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';

const ACTIONS = {
  FETCH_REQUEST: 'fetch-request',
  FETCH_SUCCESS: 'fetch-success',
  FETCH_FAIL: 'fetch-fail',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_REQUEST:
      return { ...state, loading: true };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case ACTIONS.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ products, loading, error }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: ACTIONS.FETCH_REQUEST });
      try {
        const { data } = await axios.get('/api/products');
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ACTIONS.FETCH_FAIL, payload: error.message });
      }
    };
    fetchProducts();
  }, []);
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
