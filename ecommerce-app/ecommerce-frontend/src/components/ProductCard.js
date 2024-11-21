import React from "react";

const ProductCard = ({ product, onOrder }) => {
  return (
    <div className="product-card" onClick={() => onOrder(product.product_id)}>
      <h3>{product.product_name}</h3>
      <p>{product.product_description}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock_quantity}</p>
      <button onClick={(e) => { e.stopPropagation(); onOrder(product.product_id); }}>Order</button>
    </div>
  );
};

export default ProductCard; 