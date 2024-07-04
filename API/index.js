import express from 'express';
import { productRouter } from './products.js';
import { userRouter } from './user.js';
import { orderRouter } from './orders.js';
import { reviewRouter } from './reviews.js';
import { cartRouter } from './cart.js';
import { order_productRouter } from './order_products.js';

const apiRouter = express.Router();

apiRouter.use('/product', productRouter);
apiRouter.use('/user', userRouter);
// // apiRouter.use('/cart', cartRouter);
// apiRouter.use('/order', orderRouter);
apiRouter.use('/review', reviewRouter);
// apiRouter.use('/order_product', order_productRouter);

export { apiRouter };
