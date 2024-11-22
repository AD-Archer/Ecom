// ecommerce-app/ecommerce-frontend/src/components/Orders.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import './Orders.css'; // Import the CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // State to hold error messages

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/orders", { withCredentials: true }); // Ensure this matches your backend endpoint
        console.log("Fetched orders:", response.data); // Log the fetched orders
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later."); // Set error message
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <h3>Order ID: {order.order_id}</h3>
              <p>Status: {order.order_status}</p>
              <p>Total Amount: ${order.total_amount}</p>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
