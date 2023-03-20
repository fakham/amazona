import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function Product({ product }) {
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
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
