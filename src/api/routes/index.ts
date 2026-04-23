import { Router } from 'express';
import { healthRouter } from '@api/routes/Health.routes';
import { orderRouter } from '@api/routes/Order.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/order', orderRouter);

export { mainRouter };
