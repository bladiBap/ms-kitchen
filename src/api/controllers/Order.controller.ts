import { inject, injectable } from 'tsyringe';
import { Response, Request } from 'express';
import { BaseController } from '@api/controllers/BaseController.controller';

import { IMediator } from '@core/interfaces/IMediator';
import { Result, ResultWithValue } from '@core/results/Result';
import { Mediator } from '@shared/mediator/Mediator';


import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';
import { GetOrderByIdQuery } from '@application/order/queries/GetOrderByIdQuery';
import { GetOrderByDayQuery } from '@application/order/queries/GetOrderByDayQuery';
import { OrderDTO } from '@application/order/dto/OrderDTO';
import { IncreaseQuantityOrderItemCommand } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';

@injectable()
export class OrderController extends BaseController {
	constructor(
		@inject(Mediator) private readonly mediator: IMediator,
	) {
		super();
	}

	async create(req: Request, res: Response<Result>) {
		const { date } = req.body;
		const result = await this.mediator.send(new GenerateOrderCommand(date as Date));
		return this.handlerResponse(res, result);
	}

	async getById (req: Request<{ id: string }>, res: Response<ResultWithValue<OrderDTO>>) {
		const { id } = req.params;
		const result = await this.mediator.send(new GetOrderByIdQuery(id));
		return this.handlerResponse(res, result);
	}

	async getByDay (req: Request<any, any, any, { date: Date }>, res: Response<ResultWithValue<OrderDTO>>) {
		const { date } = req.query;
		const result = await this.mediator.send(new GetOrderByDayQuery(date as Date));
		return this.handlerResponse(res, result);
	}

	async markOrderItemAsReady (req: Request<{ orderItemId: string }, any, { quantity: number }>, res: Response<Result>) {
		const { orderItemId } = req.params;
		const { quantity } = req.body;
		const result = await this.mediator.send(new IncreaseQuantityOrderItemCommand(orderItemId, quantity));
		return this.handlerResponse(res, result);
	}
}
