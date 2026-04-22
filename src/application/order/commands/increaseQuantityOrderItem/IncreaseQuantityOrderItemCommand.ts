import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class IncreaseQuantityOrderItemCommand implements IRequest<Result> {
	data!: Result;

	constructor(public readonly orderItemId: string, public readonly quantity?: number) {}
}
