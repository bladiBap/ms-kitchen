import { inject, injectable } from 'tsyringe';
import { Response, Request } from 'express';
import { BaseController } from '@api/controllers/BaseController.controller';

import { IMediator } from '@core/interfaces/IMediator';
import { Result, ResultWithValue } from '@core/results/Result';
import { Mediator } from '@shared/mediator/Mediator';


import { PackageDTO } from '@application/package/dto/PackageDTO';
import { GetPackagesByOrderQuery } from '@application/package/queries/getPackagesByOrderQuery/GetPackagesByOrderQuery';
import { CompletePackageCommand } from '@application/package/commands/completePackage/CompletePackageCommand';

@injectable()
export class PackageController extends BaseController {
	constructor(
		@inject(Mediator) private readonly mediator: IMediator,
	) {
		super();
	}

	async getByOrderId(req: Request<{ orderId: string }>, res: Response<ResultWithValue<PackageDTO[]>>) {
		const { orderId } = req.params;
		const result = await this.mediator.send(new GetPackagesByOrderQuery(orderId));
		return this.handlerResponse(res, result);
	}

	async completePackage(req: Request<{ packageId: string }>, res: Response<Result>) {
		const { packageId } = req.params;
		const result = await this.mediator.send(new CompletePackageCommand(packageId));
		return this.handlerResponse(res, result);
	}
}
