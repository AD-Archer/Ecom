require("dotenv").config(); // Load environment variables
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

app.get("/", (req, res) => {
  res.send("E-commerce server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
