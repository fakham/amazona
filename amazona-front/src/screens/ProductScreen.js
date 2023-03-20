import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { FETCH_ACTIONS } from '../utils/reducer-actions';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_ACTIONS.FETCH_REQUEST:
      return { ...state, loading: true };
    case FETCH_ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, product: action.payload };
    case FETCH_ACTIONS.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  const params = useParams();
  const { slug } = params;
  const [{ product, loading, error }, dispatch] = useReducer(reducer, {
    product: {},
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: FETCH_ACTIONS.FETCH_REQUEST });
      try {
        const { data } = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: FETCH_ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_ACTIONS.FETCH_FAIL, payload: error.message });
      }
    };
    fetchProducts();
  }, [slug]);
  return loading ? (
    <div>...Loading</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="image-large" />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary">Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
