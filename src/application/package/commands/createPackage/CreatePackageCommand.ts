import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreatePackageCommand implements IRequest<Result> {
	data!: Result;
	constructor(
		public readonly orderId: string,
        public readonly clientId: string,
        public readonly date: Date,
        public readonly recipeIds: string[]
	) {}

}
