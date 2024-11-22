// ecommerce-app/ecommerce-frontend/src/components/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOrder = (productId) => {
    console.log("Ordering product with ID:", productId);
    // Add your order logic here
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Available Products</h2>
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
