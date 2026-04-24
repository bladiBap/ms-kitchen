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

	async getDeliveryInformation(req: Request<any, any, any, { date: Date }>, res: Response<ResultWithValue<IClientDeliveredDTO[]>>) {
		const { date } = req.query;
		const result = await this.mediator.send(new GetClientsForDeliveredQuery(date as Date));
		return this.handlerResponse(res, result);
	}
}
