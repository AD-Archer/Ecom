import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session"; // Import express-session

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Update this to your frontend URL
  credentials: true // Allow credentials
})); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(session({
  secret: 'your_secret_key', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
}));

// User Registration
app.post("/api/register", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, phone]
    );
    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: err.message });
  }
});

// User Login (for simplicity, just setting user ID in session)
app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM customers WHERE email = ?", [email]);
    if (rows.length > 0) {
      req.session.userId = rows[0].customer_id; // Store user ID in session
      console.log("User logged in, session:", req.session); // Log session data
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
  const customerId = req.session.userId; // Get user ID from session
  if (!customerId) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO orders (customer_id, total_amount, order_status) VALUES (?, ?, ?)",
      [customerId, total_amount, order_status]
    );
    res.status(201).json({ message: "Order placed successfully", orderId: result.insertId });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get orders for logged-in user
app.get("/api/orders", async (req, res) => {
  const customerId = req.session.userId; // Get user ID from session
  if (!customerId) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const [results] = await db.query(`
      SELECT o.order_id, o.order_date, o.total_amount, o.order_status, 
             c.first_name, c.last_name, c.email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.customer_id = ?
    `, [customerId]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get products
app.get("/api/products", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
