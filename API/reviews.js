//user writes a review for a product
//admin can delete an review

import express from 'express';
import chalk from 'chalk';
import { client } from '../db.js';

const reviewRouter = express.Router();

reviewRouter.post('/', async (req, res) => {
  try {
    const { product_id, user_id, review } = req.body;
    const newReview = await client.query('INSERT INTO reviews (product_id, user_id, review) VALUES ($1, $2, $3) RETURNING *', [
      product_id,
      user_id,
      review,
    ]);
    res.json(newReview.rows);
    console.log(chalk.green('Successfully wrote a review'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to write a review', error));
  }
});

reviewRouter.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await client.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json(deletedReview.rows);
    console.log(chalk.green('Successfully deleted review'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to delete review', error));
  }
});

export { reviewRouter };
