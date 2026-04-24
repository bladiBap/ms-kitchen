import { Router } from 'express';
import { LazyLoadRoute } from '@shared/utils/LazyLoadRoute';
import { AddressController } from '@api/controllers/Address.controller';
import { ParamSchemaMiddleware } from '@api/middlewares/ParamSchemaMiddleware';
import { AddressIdParamSchema } from '@api/zod/schemas/address/AddressIdParamSchema';

const addressRouter = Router();

addressRouter.get(
	'/:id',
	ParamSchemaMiddleware(AddressIdParamSchema),
	LazyLoadRoute(AddressController, 'getById')
);

export { addressRouter };
