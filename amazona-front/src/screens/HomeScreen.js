import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';

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
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
