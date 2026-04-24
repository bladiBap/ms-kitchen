import { Router } from 'express';
import { LazyLoadRoute } from '@shared/utils/LazyLoadRoute';
import { PackageController } from '@api/controllers/Package.controller';
import { ParamSchemaMiddleware } from '@api/middlewares/ParamSchemaMiddleware';
import { PackageByOrderParamSchema } from '@api/zod/schemas/package/PackageByOrderParamSchema';
import { CompletePackageParamSchema } from '@api/zod/schemas/package/CompletePackageParamSchema';

const packageRouter = Router();

packageRouter.get(
	'/order/:orderId',
	ParamSchemaMiddleware(PackageByOrderParamSchema),
	LazyLoadRoute(PackageController, 'getByOrderId')
);

packageRouter.patch(
	'/:packageId/complete',
	ParamSchemaMiddleware(CompletePackageParamSchema),
	LazyLoadRoute(PackageController, 'completePackage')
);

export { packageRouter };
