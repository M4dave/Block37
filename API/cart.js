import express from 'express';
import { getCart, updateCart, deleteCart, getCartTotal } from '../db.js';

const cartRouter = express.Router();

//get cart for a user, including cart items, items total, cart total.
cartRouter.get('/:id', async (req, res) => {
  try {
    const cartItems = await getCart(req.params.id);
    const cartTotal = await getCartTotal(req.params.id);
    const response = {
      cartItems: cartItems,
      cartTotal: Number(cartTotal).toFixed(2),
    };
    res.send(response);
  } catch (err) {
    console.log('err:', err);
    res.send(err);
  }
});

//update cart item for a user
cartRouter.post('/updateCart/:id', async (req, res) => {
  try {
    await deleteCart(req.params.id);
    for (let i = 0; i < req.body.cartItems.length; i++) {
      const item = req.body.cartItems[i];
      await updateCart(req.params.id, item);
    }
    res.send({ success: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

export { cartRouter };
