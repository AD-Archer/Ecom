require("dotenv").config(); // Load environment variables
const mysql = require("mysql2");

// Create the connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");

  const sqlScript = `
    -- Create a new database if it doesn't exist
    CREATE DATABASE IF NOT EXISTS store;
    USE store;

    -- Create Customers Table
    CREATE TABLE IF NOT EXISTS customers (
        customer_id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(40) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (customer_id),
        CONSTRAINT uc_email UNIQUE (email),
        CONSTRAINT uc_phone UNIQUE (phone)
    ) ENGINE=InnoDB;

    -- Create Address Table
    CREATE TABLE IF NOT EXISTS address (
        address_id INT NOT NULL AUTO_INCREMENT,
        customer_id INT NOT NULL,
        street_name VARCHAR(30) NOT NULL,
        street_number VARCHAR(10) NOT NULL,
        zip_code VARCHAR(9) NOT NULL,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        PRIMARY KEY (address_id),
        CONSTRAINT fk_customer_address FOREIGN KEY (customer_id) 
            REFERENCES customers(customer_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB;

    -- Create Products Table
    CREATE TABLE IF NOT EXISTS products (
        product_id INT NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(50) NOT NULL,
        product_description VARCHAR(500),
        price DECIMAL(10, 2) NOT NULL,
        product_stock_quantity INT NOT NULL DEFAULT 0,
        PRIMARY KEY (product_id),
        CONSTRAINT chk_price CHECK (price >= 0),
        CONSTRAINT chk_stock CHECK (product_stock_quantity >= 0)
    ) ENGINE=InnoDB;

    -- Create Orders Table
    CREATE TABLE orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        order_status VARCHAR(20) DEFAULT 'Pending',
        total_order_amount DECIMAL(10, 2),
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        INDEX idx_customer_date (customer_id, order_date)
    );

    -- Create Order Details Table
    CREATE TABLE order_details (
        order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity_ordered INT,
        price_per_product DECIMAL(10, 2),
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        CONSTRAINT chk_quantity CHECK (quantity_ordered > 0),
        CONSTRAINT chk_price_per_product CHECK (price_per_product >= 0)
    );

    -- Insert Sample Data
    INSERT INTO customers (first_name, last_name, email, phone)
    VALUES 
        ('John', 'Doe', 'john.doe@example.com', '1234567890'),
        ('Jane', 'Smith', 'jane.smith@example.com', '0987654321');

    INSERT INTO address (customer_id, street_name, street_number, zip_code, state, city)
    VALUES 
        (1, 'Main St', '123', '12345', 'PA', 'Philadelphia'),
        (2, 'Second St', '456', '67890', 'PA', 'Philadelphia');

    INSERT INTO products (product_name, product_description, price, product_stock_quantity)
    VALUES 
        ('HotPockets', 'YUM', 5.99, 90),
        ('Bananas', 'YUMMY', 0.99, 250),
        ('Tomatoes', 'Fresh and Juicy', 1.99, 110);

    INSERT INTO orders (customer_id, order_status, total_order_amount)
    VALUES 
        (1, 'Shipped', 15.96);

    INSERT INTO order_details (order_id, product_id, quantity_ordered, price_per_product)
    VALUES 
        (1, 1, 2, 5.99),
        (1, 2, 3, 0.99);

    -- Update Product Stock
    UPDATE products
    SET product_stock_quantity = product_stock_quantity - 2
    WHERE product_id = 1;

    UPDATE products
    SET product_stock_quantity = product_stock_quantity - 3
    WHERE product_id = 2;

    -- Select all customers for verification
    SELECT * FROM customers;
  `;

  // Execute the SQL script
  db.query(sqlScript, (err, results) => {
    if (err) {
      console.error("Error executing SQL script:", err);
      return;
    }
    console.log("SQL script executed successfully:", results);
  });

  // Close the database connection after queries are complete
  db.end((err) => {
    if (err) {
      console.error("Error closing the connection:", err);
    } else {
      console.log("Database connection closed.");
    }
  });
});
