import chalk from 'chalk';
import { client } from '../db.js';
import express from 'express';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  try {
    const products = await client.query('SELECT * FROM Products');
    res.json(products.rows);
    console.log(chalk.green('Successfully got products'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to get products', error));
  }
});

//Get product by id
productRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await client.query('SELECT * FROM Products WHERE id = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product.rows[0]);
    console.log(chalk.green('Successfully got product', id));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to get product', error));
  }
});

//Sort products by price
productRouter.get('/sort/asc', async (req, res) => {
  try {
    const products = await client.query('SELECT * FROM Products ORDER BY price ASC');
    res.json(products.rows);
    console.log(chalk.green('Successfully sorted products by price ascending'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to sort products by price ascending', error));
  }
});

//Sort products by price descending
productRouter.get('/sort/desc', async (req, res) => {
  try {
    const products = await client.query('SELECT * FROM Products ORDER BY price DESC');
    res.json(products.rows);
    console.log(chalk.green('Successfully sorted products by price descending'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to sort products by price descending', error));
  }
});

//Filter products by category
productRouter.get('/filter/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await client.query('SELECT * FROM Products WHERE category = $1', [category]);
    res.json(products.rows);
    console.log(chalk.green('Successfully filtered products by category', category));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to filter products by category', error));
  }
});

//Update product
productRouter.put(':id', async (req, res) => {
  try {
    const { id } = req.params;
    const { availability, details, status } = req.body;
    const isAdmin = true;
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const product = await client.query(
      'UPDATE products SET availability = $1, details = $2, status = $3 WHERE id = $4 RETURNING *',
      [availability, details, status, id]
    );
    res.json(product.rows[0]);
    console.log(chalk.green('Successfully updated product'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to update product', error));
  }
});

//Delete product
productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = true;
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const product = await client.query('DELETE FROM products WHERE id = $1', [id]);
    res.json(product.rows);
    console.log(chalk.green('Successfully deleted product'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to delete product', error));
  }
});

// Error handling middleware
// app.use(errorHandler);

export { productRouter };
