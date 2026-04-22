import { Router } from 'express';
import { LazyLoadRoute } from '@shared/utils/LazyLoadRoute';
import { OrderController } from '@api/controllers/Order.controller';
import { AuthMiddleware } from '@api/middlewares/AuthMiddleware';
import { BodySchemaMiddleware } from '@api/middlewares/BodySchemaMiddleware';
import { ParamSchemaMiddleware } from '@api/middlewares/ParamSchemaMiddleware';
// import { IniciarSesionSchema } from '@api/zod/schemas/usuario/IniciarSesionSchema';
// import { CrearUsuarioSchema } from '@api/zod/schemas/usuario/CrearUsuarioSchema';
// import { CrearUsuarioRedSocialSchema } from '@api/zod/schemas/usuario/CrearUsuarioRedSocialSchema';
// import { CrearManillaSchema } from '@api/zod/schemas/usuario/CrearManillaSchema';
// import { ManillaParamSchema } from '@api/zod/schemas/usuario/ManillaParamSchema';
// import { ActualizarNombreManillaSchema } from '@api/zod/schemas/usuario/ActualizarNombreManillaSchema';
// import { ActualizarPinManillaSchema } from '@api/zod/schemas/usuario/ActualizarPinManillaSchema';
// import { VincularManillaSchema } from '@api/zod/schemas/usuario/VincularManillaSchema';
// import { ActualizarUsuarioSchema } from '@api/zod/schemas/usuario/ActualizarUsuarioSchema';

const orderRouter = Router();

orderRouter.post(
	'',
	LazyLoadRoute(OrderController, 'create')
);


// orderRouter.get('/me', AuthMiddleware(), LazyLoadRoute(OrderController, 'getMe'));

// orderRouter.post('', BodySchemaMiddleware(CrearUsuarioSchema), LazyLoadRoute(OrderController, 'crear'));

// orderRouter.post(
// 	'/iniciar-sesion',
// 	BodySchemaMiddleware(IniciarSesionSchema),
// 	LazyLoadRoute(OrderController, 'iniciarSesion'),
// );

// orderRouter.patch(
// 	'/manilla/:manillaId/desvincular',
// 	AuthMiddleware(),
// 	ParamSchemaMiddleware(ManillaParamSchema),
// 	LazyLoadRoute(OrderController, 'desvincularManilla'),
// );

export { orderRouter };
