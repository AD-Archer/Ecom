// ecommerce-app/src/index.js
import express from 'express'; // Importing the Express module using ES6 syntax
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express(); // Creating an instance of the Express application
const PORT = process.env.PORT || 3000; // Set the port

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`); // Log the HTTP method and URL of the request
  next(); // Pass control to the next middleware or route handler
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Route for the Home Page
app.get('/', (req, res) => {
  res.send('Home Page'); // Send a response back to the user
});

// API endpoint to get products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API endpoint to create a new product
app.post("/api/products", (req, res) => {
  const { product_name, product_description, price, stock_quantity } = req.body;
  const query = "INSERT INTO products (product_name, product_description, price, stock_quantity) VALUES (?, ?, ?, ?)";
  
  db.query(query, [product_name, product_description, price, stock_quantity], (err, results) => {
    if (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      product_id: results.insertId,
      product_name,
      product_description,
      price,
      stock_quantity,
    });
  });
});

// API endpoint to create an order
app.post("/api/orders", (req, res) => {
  const { product_id, quantity } = req.body;

  // Validate input
  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid product ID or quantity" });
  }

  // Check if the product exists and has enough stock
  db.query("SELECT * FROM products WHERE product_id = ?", [product_id], (err, results) => {
    if (err) {
      console.error("Error fetching product for order:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = results[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Update the stock quantity
    const newStockQuantity = product.stock_quantity - quantity;
    db.query("UPDATE products SET stock_quantity = ? WHERE product_id = ?", [newStockQuantity, product_id], (err) => {
      if (err) {
        console.error("Error updating stock quantity:", err);
        return res.status(500).json({ error: err.message });
      }

      // Respond with the order details
      res.status(201).json({
        message: "Order placed successfully",
        product_id,
        quantity,
        remaining_stock: newStockQuantity,
      });
    });
  });
});

// Start the server on a specified port (default to 3000)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log that the server is running
});
