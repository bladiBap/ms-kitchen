import { Router } from 'express';
import { orderRouter } from '@api/routes/Order.routes';

const mainRouter = Router();

mainRouter.use('/order', orderRouter);

export { mainRouter };
