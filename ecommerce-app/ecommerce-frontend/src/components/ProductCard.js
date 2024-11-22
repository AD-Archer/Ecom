import React from "react";

const ProductCard = ({ product, onOrder }) => {
  console.log("onOrder prop:", onOrder);
  const handleOrder = () => {
    if (onOrder) {
      onOrder(product.product_id);
    } else {
      console.error("onOrder is not a function");
    }
  };

  return (
    <div className="product-card">
      <h3>{product.product_name}</h3>
      <p>{product.product_description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleOrder}>Order</button>
    </div>
  );
};

export default ProductCard; 