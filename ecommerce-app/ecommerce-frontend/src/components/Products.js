// ecommerce-app/ecommerce-frontend/src/components/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOrder = async (product_id) => {
    try {
      const response = await axios.post("http://localhost:3000/api/orders", { product_id, quantity: orderQuantity });
      console.log("Order response:", response.data);
      fetchProducts(); // Re-fetch products to update stock
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Available Products</h2>
      <input
        type="number"
        value={orderQuantity}
        onChange={(e) => setOrderQuantity(e.target.value)}
        min="1"
        placeholder="Quantity"
      />
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.product_id} product={product} onOrder={handleOrder} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
