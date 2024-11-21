import mysql from 'mysql2/promise';

// Create a connection to the database
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // replace with your MySQL username
    password: 'your_password', // replace with your MySQL password
    database: 'ecommerce_db' // replace with your database name
});

try {
    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS ecommerce_db');
    await connection.query('USE ecommerce_db');

    // Create tables
    await connection.query(`
        CREATE TABLE IF NOT EXISTS customers (
            customer_id INT NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (customer_id),
            CONSTRAINT uc_email UNIQUE (email)
        ) ENGINE=InnoDB
    `);

    // Add more table creation queries as needed...

    console.log('Database and tables created successfully.');
} catch (error) {
    console.error('Error executing query:', error);
} finally {
    // Close the connection
    await connection.end();
} 