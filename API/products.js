//For David:

//review all products
//sort product price ascending
//sort produce price descending
//filter product by category
//individual product details
//update 1.availability, 2. product details, 3.status, ONLY for an admin user
//delete a product, ONLY for an admin user

import express from "express";
import chalk from "chalk";
import { client } from "../db.js";
import pg from "pg";

// const app = express();
// const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/Block37");

// app.use(express.json());

// client.connect()
//   .then(() => console.log(chalk.green("Connected to PostgreSQL database.")))
//   .catch(err => console.error(chalk.red("Failed to connect to database:", err)));

// Middleware for error handling
// const errorHandler = (err, req, res, next) => {
//   console.error(chalk.red("Error:", err.message));
//   res.status(500).json({ error: "Internal Server Error" });
// };

//Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await client.query("SELECT * FROM products");
    res.json(products.rows);
    console.log(chalk.green("Successfully got products"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to get products", error));
  }
});

//Get product by id
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await client.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product.rows[0]);
    console.log(chalk.green("Successfully got product", id));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to get product", error));
  }
});

app.get("/products/sort/asc", async (req, res) => {
  try {
    const products = await client.query(
      "SELECT * FROM products ORDER BY price ASC"
    );
    res.json(products.rows);
    console.log(chalk.green("Successfully sorted products by price ascending"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to sort products by price ascending", error));
  }
});

app.get("/products/sort/desc", async (req, res) => {
  try {
    const products = await client.query(
      "SELECT * FROM products ORDER BY price DESC"
    );
    res.json(products.rows);
    console.log(
      chalk.green("Successfully sorted products by price descending")
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(
      chalk.red("Failed to sort products by price descending", error)
    );
  }
});

app.get("/products/filter/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await client.query(
      "SELECT * FROM products WHERE category = $1",
      [category]
    );
    res.json(products.rows);
    console.log(
      chalk.green("Successfully filtered products by category", category)
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to filter products by category", error));
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { availability, details, status } = req.body;
    const isAdmin = true;
    if (!isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const product = await client.query(
      "UPDATE products SET availability = $1, details = $2, status = $3 WHERE id = $4 RETURNING *",
      [availability, details, status, id]
    );
    res.json(product.rows[0]);
    console.log(chalk.green("Successfully updated product"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to update product", error));
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = true;
    if (!isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const product = await client.query("DELETE FROM products WHERE id = $1", [
      id,
    ]);
    res.json(product.rows);
    console.log(chalk.green("Successfully deleted product"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to delete product", error));
  }
});

// Error handling middleware
// app.use(errorHandler);

export default app;
