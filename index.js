//server
import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createTables, createProducts } from './db.js';
import { apiRouter } from './API/index.js';

const jwtSignature = 'secretForNow';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

//middleware
app.use((req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else {
    try {
      const token = auth.slice(prefix.length);
      jwt.verify(token, jwtSignature);
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).send('Token has expired');
      } else if (err.name === 'JsonWebTokenError') {
        res.status(403).send('Invalid token');
      } else {
        res.status(500).send('Internal server error');
      }
    }
  }
});

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
