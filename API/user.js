import express from 'express';
import bcyrpt from 'bcrypt';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { client, updateCart } from '../db.js';

const jwtSignature = 'secretForNow';

const userRouter = express.Router();

//Register
userRouter.post('/register', async (req, res) => {
  try {
    const { Username, Email, Password, Address } = req.body;
    const hashedPassword = await bcyrpt.hash(Password, 10);
    const newUser = await client.query(
      'INSERT INTO Users (Username, Email, Password, Address) VALUES ($1, $2, $3, $4) RETURNING *',
      [Username, Email, hashedPassword, Address]
    );
    res.json(newUser.rows);
    console.log(chalk.green('Successfully registered'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to register', error));
  }
});

//Login
userRouter.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const result = await client.query('SELECT * FROM Users WHERE Email = $1', [Email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isAuthenticated = await bcyrpt.compare(Password, user.password);

    if (isAuthenticated) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        jwtSignature,
        { expiresIn: '1w' }
      );

      // get req.body.cartItems, if arrary is not empty, merge items to cart table
      for (let i = 0; i < req.body.cartItems.length; i++) {
        const item = req.body.cartItems[i];
        await updateCart(user.id, item);
      }

      res.send({
        message: 'Successfully logged in',
        token: token,
      });

      // save token locally in front end

      console.log(chalk.green('Successfully logged in'));
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
      console.log(chalk.red('Failed to log in: Invalid password'));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to log in', error));
  }
});

//Update User Profile
userRouter.put('/:id', async (req, res) => {
  try {
    const { Username, Email, Password, Address } = req.body;
    const updatedUser = await client.query(
      'UPDATE Users SET Username = $1, Email = $2, Password = $3, Address=$4 WHERE id = $5 RETURNING *',
      [Username, Email, Password, Address, req.params.id]
    );
    res.json(updatedUser.rows);
    console.log(chalk.green('Successfully updated user profile'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to update user profile', error));
  }
});

//Get all Users
userRouter.get('/', async (req, res) => {
  try {
    const allUsers = await client.query('SELECT * FROM Users');
    res.json(allUsers.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get User by username
userRouter.get('/username', async (req, res) => {
  try {
    const user = await client.query(`SELECT * FROM Users WHERE Username = '${req.body.username}'`);
    res.json(user.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get wishlist
userRouter.get('/:id/wishlist', async (req, res) => {
  try {
    const wishlist = await client.query('SELECT Wishlist FROM Users WHERE ID = $1', [
      req.params.id,
    ]);
    res.send(wishlist.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to get wishlist', error));
  }
});

//Add wishlist
userRouter.post('/:id/wishlist', async (req, res) => {
  try {
    const { product_id } = req.body;
    const productResult = await client.query('SELECT Name FROM Products WHERE ID = $1', [
      product_id,
    ]);
    const product = productResult.rows[0];
    const productName = product.name;

    const userId = req.params.id;
    const userResult = await client.query('SELECT Wishlist FROM Users WHERE ID = $1', [userId]);
    const user = userResult.rows[0];

    let wishlist = user.wishlist ? user.wishlist.split(',') : [];
    wishlist.push(productName);
    const updatedWishlist = wishlist.join(',');

    const updateResult = await client.query(
      'UPDATE Users SET Wishlist = $1 WHERE ID = $2 RETURNING *',
      [updatedWishlist, userId]
    );
    res.json(updateResult.rows[0]);
    console.log(chalk.green('Successfully added to wishlist'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to add to wishlist', error));
  }
});

//Delete a user
userRouter.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await client.query('DELETE FROM Users WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);
    res.json(deletedUser.rows);
    console.log(chalk.green('Successfully deleted user'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to delete user', error));
  }
});

//Ban a user
userRouter.put('/:id/ban', async (req, res) => {
  try {
    const bannedUser = await client.query(
      "UPDATE Users SET status = 'banned' WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(bannedUser.rows);
    console.log(chalk.green('Successfully banned user'));
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(chalk.red('Failed to ban user', error));
  }
});

export { userRouter };
