import express from 'express';
import { productRouter } from './products.js';
import { userRouter } from './user.js';
import { orderRouter } from './orders.js';
import { reviewRouter } from './reviews.js';
import { cartRouter } from './cart.js';

const apiRouter = express.Router();

apiRouter.use('/product', productRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/review', reviewRouter);

export { apiRouter };
