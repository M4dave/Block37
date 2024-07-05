import express from 'express';
import { createOrders, getOrdersByUser, getAllOrders } from '../db.js';

const orderRouter = express.Router();

//create an order
orderRouter.post('/:id', async (req, res) => {
  try {
    const orders = await createOrders(req.params.id, req.body.order_total);
    res.send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get orders of a user
orderRouter.get('/:id', async (req, res) => {
  try {
    const response = await getOrdersByUser(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

export { orderRouter };

//get all orders in DB
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});
