import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from "dotenv";

const app = express();
const PORT = 3000; // or any port you prefer

// Middleware
app.use(bodyParser.json());

// Create a connection to the database
   dotenv.config();

   const connection = await mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
   });

// Endpoint to add a product
app.post('/api/products', async (req, res) => {
    const { product_name, product_description, price, stock_quantity } = req.body;

    try {
        const [result] = await connection.execute(
            'INSERT INTO products (product_name, product_description, price, stock_quantity) VALUES (?, ?, ?, ?)',
            [product_name, product_description, price, stock_quantity]
        );
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 