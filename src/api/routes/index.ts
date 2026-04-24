import { Router } from 'express';
import { healthRouter } from '@api/routes/Health.routes';
import { orderRouter } from '@api/routes/Order.routes';
import { addressRouter } from '@api/routes/Address.routes';
import { clientRouter } from '@api/routes/Client.routes';
import { packageRouter } from '@api/routes/Package.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/order', orderRouter);
mainRouter.use('/address', addressRouter);
mainRouter.use('/client', clientRouter);
mainRouter.use('/package', packageRouter);

export { mainRouter };
