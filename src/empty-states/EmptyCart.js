import React from 'react';
import emptycart from '../images/empty-cart.png';

const EmptyCart = (props) => {
  return (
    <div className="empty-cart">
      <img src={emptycart} alt="empty-cart" />
      <h2>You cart is empty!</h2>
    </div>
  );
};

export default EmptyCart;
