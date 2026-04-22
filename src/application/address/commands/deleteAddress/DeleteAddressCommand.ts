import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class DeleteAddressCommand implements IRequest<Result> {
	data!: Result;
	constructor(
        public readonly id: string
	) {}
}
