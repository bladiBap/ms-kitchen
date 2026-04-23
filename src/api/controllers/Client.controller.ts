import { inject, injectable } from 'tsyringe';
import { Response, Request } from 'express';
import { BaseController } from '@api/controllers/BaseController.controller';

import { IMediator } from '@core/interfaces/IMediator';
import { ResultWithValue } from '@core/results/Result';
import { Mediator } from '@shared/mediator/Mediator';
import { IClientDeliveredDTO } from '@application/client/dto/dto';
import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';

@injectable()
export class ClientController extends BaseController {
	constructor(
		@inject(Mediator) private readonly mediator: IMediator,
	) {
		super();
	}

	async getDeliveryInformation(req: Request, res: Response<ResultWithValue<IClientDeliveredDTO[]>>) {
		const { date } = req.body;
		const dateObj = new Date(date);
		const result = await this.mediator.send(new GetClientsForDeliveredQuery(dateObj));
		return this.handlerResponse(res, result);
	}
}
