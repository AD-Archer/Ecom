// ecommerce-app/ecommerce-frontend/src/components/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts
  }, []);

  // Handle placing an order
  const handleOrder = async (product_id) => {
    const quantity = 1; // You can modify this to allow user input for quantity
    try {
      const response = await axios.post("http://localhost:3000/api/orders", { product_id, quantity });
      console.log("Order response:", response.data);
      fetchProducts(); // Re-fetch products to update stock
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Available Products</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card" onClick={() => handleOrder(product.product_id)}>
              <h3>{product.product_name}</h3>
              <p>{product.product_description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock_quantity}</p>
              <button onClick={(e) => { e.stopPropagation(); handleOrder(product.product_id); }}>Order</button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
