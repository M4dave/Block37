//register
//login
//order history, the purchase price at that time
//update user profile
//up to 3 wishlist per user
//admin can ban a user

import express from "express";
import chalk from "chalk";
import { client } from "../db.js";

app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await client.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );
    res.json(newUser.rows);
    console.log(chalk.green("Successfully registered"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to register", error));
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    res.json(user.rows);
    console.log(chalk.green("Successfully logged in"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to log in", error));
  }
});

app.get("/users/:id/orders", async (req, res) => {
  try {
    const orders = await client.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [req.params.id]
    );
    res.json(orders.rows);
    console.log(chalk.green("Successfully got orders"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to get orders", error));
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updatedUser = await client.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [username, email, password, req.params.id]
    );
    res.json(updatedUser.rows);
    console.log(chalk.green("Successfully updated user profile"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to update user profile", error));
  }
});

app.get("/users/:id/wishlist", async (req, res) => {
  try {
    const wishlist = await client.query(
      "SELECT * FROM wishlist WHERE user_id = $1",
      [req.params.id]
    );
    res.json(wishlist.rows);
    console.log(chalk.green("Successfully got wishlist"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to get wishlist", error));
  }
});

app.post("/users/:id/wishlist", async (req, res) => {
  try {
    const { product_id } = req.body;
    const newWishlist = await client.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [req.params.id, product_id]
    );
    res.json(newWishlist.rows);
    console.log(chalk.green("Successfully added to wishlist"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to add to wishlist", error));
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await client.query("DELETE FROM users WHERE id = $1", [
      req.params.id,
    ]);
    res.json(deletedUser.rows);
    console.log(chalk.green("Successfully deleted user"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to delete user", error));
  }
});

app.put("/users/:id/ban", async (req, res) => {
  try {
    const bannedUser = await client.query(
      "UPDATE users SET status = 'banned' WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(bannedUser.rows);
    console.log(chalk.green("Successfully banned user"));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red("Failed to ban user", error));
  }
});

export default app;
