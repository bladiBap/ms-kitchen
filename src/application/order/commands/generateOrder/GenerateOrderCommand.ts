import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class GenerateOrderCommand implements IRequest<Result> {
	data!: Result;
	constructor(public readonly date: Date) {}
}
