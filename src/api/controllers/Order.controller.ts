import { inject, injectable } from 'tsyringe';
import { Response, Request } from 'express';
import { BaseController } from '@api/controllers/BaseController.controller';

import { IMediator } from '@core/interfaces/IMediator';
import { Result, ResultWithValue } from '@core/results/Result';
import { Mediator } from '@shared/mediator/Mediator';


import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';

// import { UsuarioDTO } from '@application/usuario/dto/UsuarioDTO';
// import { ManillaDTO } from '@application/usuario/dto/ManillaDTO';
// import { IniciarSesionDTO } from '@application/usuario/dto/IniciarSesionDTO';

// import { CrearManillaCommand } from '@application/usuario/commands/CrearManilla/CrearManillaCommand';
// import { IniciarSesionCommand } from '@application/usuario/commands/IniciarSesion/IniciarSesionCommand';
// import { RegistrarUsuarioCommand } from '@application/usuario/commands/Registrar/RegistrarUsuarioCommand';
// import { RegistrarUsuarioGoogleCommand } from '@application/usuario/commands/RegistrarPorGoogle/RegistrarUsuarioGoogleCommand';
// import { RegistrarUsuarioFacebookCommand } from '@application/usuario/commands/RegistrarPorMeta/RegistrarUsuarioMetaCommand';
// import { ActualizarNombreManillaCommand } from '@application/usuario/commands/ActualizarNombreManilla/ActualizarNombreManillaCommand';
// import { ActualizarEstadoManillaCommand } from '@application/usuario/commands/ActualizarEstadoManilla/ActualizarEstadoManillaCommand';
// import { ActualizarPinManillaCommand } from '@application/usuario/commands/ActualizarPinManilla/ActualizarPinManillaCommand';
// import { EliminarManillaCommand } from '@application/usuario/commands/EliminarManilla/EliminarManillaCommand';
// import { VincularManillaCommand } from '@application/usuario/commands/VincularManilla/VincularManillaCommand';
// import { DesvincularManillaCommand } from '@application/usuario/commands/DesvincularManilla/DesvincularManillaCommand';

// import { GetUsuarioMeQuery } from '@application/usuario/queries/GetMe/GetUsuarioMeQuery';
// import { GetUsuarioManillasQuery } from '@application/usuario/queries/GetManillas/GetUsuarioManillasQuery';
// import { GetUsuarioManillaPorIdQuery } from '@application/usuario/queries/GetManillaPorId/GetUsuarioManillaPorIdQuery';
// import { ActualizarUsuarioCommand } from '@application/usuario/commands/Actualizar/ActualizarUsuarioCommand';
// import { ActualizarUsuarioRequest } from '@api/RequestModels/ActualizarUsuarioRequest';
@injectable()
export class OrderController extends BaseController {
	constructor(
		@inject(Mediator) private readonly mediator: IMediator,
	) {
		super();
	}

	async create(req: Request, res: Response<Result>) {
		const { date } = req.body;
		const dateObj = new Date(date);
		const result = await this.mediator.send(new GenerateOrderCommand(dateObj));
		return this.handlerResponse(res, result);
	}
	// async getMe(req: Request, res: Response<ResultWithValue<UsuarioDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const result = await this.mediator.send(new GetUsuarioMeQuery(usuarioId));
	// 	return this.handlerResponse(res, result);
	// }

	// async iniciarSesion(req: Request, res: Response<ResultWithValue<IniciarSesionDTO>>) {
	// 	const { correo, contrasena } = req.body;
	// 	const result = await this.mediator.send(new IniciarSesionCommand(correo, contrasena));
	// 	return this.handlerResponse(res, result);
	// }

	// async crear(req: Request, res: Response<ResultWithValue<IniciarSesionDTO>>) {
	// 	const { nombre, apellido, correo, contrasena } = req.body;
	// 	const result = await this.mediator.send(new RegistrarUsuarioCommand(nombre, apellido, correo, contrasena));
	// 	return this.handlerResponse(res, result);
	// }

	// async registrarPorFacebook(req: Request, res: Response<ResultWithValue<IniciarSesionDTO>>) {
	// 	const { token } = req.body;
	// 	const result = await this.mediator.send(new RegistrarUsuarioFacebookCommand(token));
	// 	return this.handlerResponse(res, result);
	// }

	// async registrarPorGoogle(req: Request, res: Response<ResultWithValue<IniciarSesionDTO>>) {
	// 	const { token } = req.body;
	// 	const result = await this.mediator.send(new RegistrarUsuarioGoogleCommand(token));
	// 	return this.handlerResponse(res, result);
	// }

	// async crearManilla(req: Request, res: Response<Result>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const { tagId, nombre } = req.body;
	// 	const result = await this.mediator.send(new CrearManillaCommand(usuarioId, tagId, nombre));
	// 	return this.handlerResponse(res, result);
	// }

	// async obtenerManillas(req: Request, res: Response<ResultWithValue<ManillaDTO[]>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const result = await this.mediator.send(new GetUsuarioManillasQuery(usuarioId));
	// 	return this.handlerResponse(res, result);
	// }

	// async obtenerManillaPorId(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const result = await this.mediator.send(new GetUsuarioManillaPorIdQuery(usuarioId, manillaId));
	// 	return this.handlerResponse(res, result);
	// }

	// async actualizarNombreManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const { nombre } = req.body;
	// 	const result = await this.mediator.send(new ActualizarNombreManillaCommand(usuarioId, manillaId, nombre));
	// 	return this.handlerResponse(res, result);
	// }

	// async activarManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const result = await this.mediator.send(new ActualizarEstadoManillaCommand(usuarioId, manillaId, true));
	// 	return this.handlerResponse(res, result);
	// }

	// async desactivarManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const result = await this.mediator.send(new ActualizarEstadoManillaCommand(usuarioId, manillaId, false));
	// 	return this.handlerResponse(res, result);
	// }

	// async actualizarPinManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const { nuevoPin } = req.body;
	// 	const result = await this.mediator.send(new ActualizarPinManillaCommand(usuarioId, manillaId, nuevoPin));
	// 	return this.handlerResponse(res, result);
	// }

	// async eliminarManilla(req: Request, res: Response<Result>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const result = await this.mediator.send(new EliminarManillaCommand(usuarioId, manillaId));
	// 	return this.handlerResponse(res, result);
	// }

	// async vincularManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const { tagId } = req.body;
	// 	const result = await this.mediator.send(new VincularManillaCommand(usuarioId, manillaId, tagId));
	// 	return this.handlerResponse(res, result);
	// }

	// async desvincularManilla(req: Request, res: Response<ResultWithValue<ManillaDTO>>) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const manillaId = parseInt(req.params.manillaId as string, 10);
	// 	const result = await this.mediator.send(new DesvincularManillaCommand(usuarioId, manillaId));
	// 	return this.handlerResponse(res, result);
	// }

	// async actualizar(
	// 	req: Request<unknown, unknown, ActualizarUsuarioRequest>,
	// 	res: Response<ResultWithValue<UsuarioDTO>>,
	// ) {
	// 	const usuarioId = req.usuario!.usuarioId;
	// 	const { nombre, apellido, correo } = req.body;

	// 	const result = await this.mediator.send(new ActualizarUsuarioCommand(usuarioId, nombre, apellido, correo));

	// 	return this.handlerResponse(res, result);
	// }
}
