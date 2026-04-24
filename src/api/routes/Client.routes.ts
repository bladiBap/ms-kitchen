import { Router } from 'express';
import { LazyLoadRoute } from '@shared/utils/LazyLoadRoute';
import { ClientController } from '@api/controllers/Client.controller';
import { QuerySchemaMiddleware } from '@api/middlewares/QuerySchemaMiddleware';
import { GetDeliveryInformationBodySchema } from '@api/zod/schemas/client/GetDeliveryInformationBodySchema';

const clientRouter = Router();

clientRouter.get(
	'/delivery-information',
	QuerySchemaMiddleware(GetDeliveryInformationBodySchema),
	LazyLoadRoute(ClientController, 'getDeliveryInformation')
);

export { clientRouter };
