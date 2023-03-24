import axios from 'axios';
import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CART_ACTIONS } from '../utils/reducer-actions';
import { Store } from '../utils/Store';
import Rating from './Rating';

export default function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const exitsItem = cartItems.find((x) => x._id === product._id);
    const quantity = exitsItem ? exitsItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: CART_ACTIONS.CART_ADD_ITEM,
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <Card.Img variant="top" src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Card.Title>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </Card.Title>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          <strong>${product.price}</strong>
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
