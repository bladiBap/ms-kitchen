import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CompletePackageCommand implements IRequest<Result> {
	data!: Result;
	constructor(
		public readonly packageId: string
	) {}

}
