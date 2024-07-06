//server
import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import { createTables, createProducts, createCart, createOrders, createOrder_Product, createReviews } from './db.js';
import { apiRouter } from './API/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await createTables();
    await createProducts();
    app.listen(port, () => {
      console.log(chalk.green(`server successfully listens on port ${port}`));
    });
  } catch (error) {}
};

startServer();
