import { Router } from 'express';
import { LazyLoadRoute } from '@shared/utils/LazyLoadRoute';
import { OrderController } from '@api/controllers/Order.controller';
import { BodySchemaMiddleware } from '@api/middlewares/BodySchemaMiddleware';
import { ParamSchemaMiddleware } from '@api/middlewares/ParamSchemaMiddleware';
import { QuerySchemaMiddleware } from '@api/middlewares/QuerySchemaMiddleware';
import { CreateOrderBodySchema } from '@api/zod/schemas/order/CreateOrderBodySchema';
import { OrderIdParamSchema } from '@api/zod/schemas/order/OrderIdParamSchema';
import { GetOrderByDayQuerySchema } from '@api/zod/schemas/order/GetOrderByDayQuerySchema';
import { MarkOrderItemAsReadyParamSchema } from '@api/zod/schemas/order/MarkOrderItemAsReadyParamSchema';
import { MarkOrderItemAsReadyBodySchema } from '@api/zod/schemas/order/MarkOrderItemAsReadyBodySchema';

const orderRouter = Router();

orderRouter.post(
	'',
	BodySchemaMiddleware(CreateOrderBodySchema),
	LazyLoadRoute(OrderController, 'create')
);

orderRouter.get(
	'/day',
	QuerySchemaMiddleware(GetOrderByDayQuerySchema),
	LazyLoadRoute(OrderController, 'getByDay')
);

orderRouter.get(
	'/:id',
	ParamSchemaMiddleware(OrderIdParamSchema),
	LazyLoadRoute(OrderController, 'getById')
);

orderRouter.patch(
	'/item/:orderItemId/ready',
	ParamSchemaMiddleware(MarkOrderItemAsReadyParamSchema),
	BodySchemaMiddleware(MarkOrderItemAsReadyBodySchema),
	LazyLoadRoute(OrderController, 'markOrderItemAsReady')
);

export { orderRouter };
