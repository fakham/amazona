import React from 'react';

export default function Rating({ rating, numReviews }) {
  return (
    <div className="rating">
      {[...Array(5).keys()].map((x, i) => (
        <span key={x}>
          <i
            className={
              rating >= i + 1
                ? 'fas fa-star'
                : rating >= 0.5 + i
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      <span>{' ' + numReviews + ' reviews'}</span>
    </div>
  );
}
