import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import sequelize from './models/index.js'; // Import Sequelize configuration
import Customer from './models/Customer.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Sync Sequelize models with the database
sequelize.sync();

// User Registration
app.post("/api/register", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    const customer = await Customer.create({ first_name, last_name, email, phone });
    res.status(201).json({ message: "User registered successfully", userId: customer.customer_id });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  try {
    const customer = await Customer.findOne({ where: { email } });
    if (customer) {
      req.session.userId = customer.customer_id;
      console.log("User logged in, session:", req.session);
      res.json({ message: "User logged in successfully" });
    } else {
      res.status(401).json({ error: "Invalid email" });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: err.message });
  }
});

// Place Order
app.post("/api/orders", async (req, res) => {
  const { total_amount, order_status } = req.body;
  const customerId = req.session.userId;
  if (!customerId) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const order = await Order.create({ customer_id: customerId, total_amount, order_status });
    res.status(201).json({ message: "Order placed successfully", orderId: order.order_id });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get orders for logged-in user
app.get("/api/orders", async (req, res) => {
  const customerId = req.session.userId;
  if (!customerId) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const orders = await Order.findAll({
      where: { customer_id: customerId },
      include: [{ model: Customer, attributes: ['first_name', 'last_name', 'email'] }]
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
