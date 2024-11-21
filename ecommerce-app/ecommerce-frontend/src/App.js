// ecommerce-app/ecommerce-frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";
import Orders from "./components/Orders";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <header>
        <h1>E-commerce Store</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
