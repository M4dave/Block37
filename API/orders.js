import express from 'express';
import {
  createOrders,
  getOrdersByUser,
  getAllOrders,
  calculateOrderTotal,
  createOrder_Product,
  allOrderItems,
  getItemsByOrderId,
} from '../db.js';

const orderRouter = express.Router();

//create an order and create order_product
orderRouter.post('/:id/items', async (req, res) => {
  const orderTotal = await calculateOrderTotal(req.body.order_items);

  try {
    const newOrder = await createOrders(req.params.id, orderTotal);
    const orderID = newOrder[0].id;

    for (let i = 0; i < req.body.order_items.length; i++) {
      const item = req.body.order_items[i];
      createOrder_Product(orderID, item.productID, item.quantity);
    }

    res.status(201).send(newOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get orders of a user
orderRouter.get('/id/:id', async (req, res) => {
  try {
    const response = await getOrdersByUser(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get all orders in DB
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get all items in all orders
orderRouter.get('/allOrderItems', async (req, res) => {
  try {
    const orderItems = await allOrderItems();
    res.send(orderItems);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get items by Order ID
orderRouter.get('/orderItems/:id', async (req, res) => {
  try {
    const orderItems = await getItemsByOrderId(req.params.id);
    res.send(orderItems);
  } catch (err) {
    res.status(500).send(err);
  }
});

export { orderRouter };
