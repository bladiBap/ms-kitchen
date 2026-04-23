import { inject, injectable } from 'tsyringe';
import { Response, Request } from 'express';
import { BaseController } from '@api/controllers/BaseController.controller';

import { IMediator } from '@core/interfaces/IMediator';
import { ResultWithValue } from '@core/results/Result';
import { Mediator } from '@shared/mediator/Mediator';
import { AddressDTO } from '@application/address/dto/AddressDto';
import { GetAddressByIdQuery } from '@application/address/query/GetAddressByIdQuery';

@injectable()
export class AddressController extends BaseController {
	constructor(
		@inject(Mediator) private readonly mediator: IMediator,
	) {
		super();
	}

	async getById (req: Request<{ id: string }>, res: Response<ResultWithValue<AddressDTO>>) {
		const { id } = req.params;
		const result = await this.mediator.send(new GetAddressByIdQuery(id));
		return this.handlerResponse(res, result);
	}
}
