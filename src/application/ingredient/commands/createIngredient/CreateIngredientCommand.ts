import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreateIngredientCommand implements IRequest<Result> {
	
	data!: Result;

	constructor(
		public readonly id : string,
		public readonly name : string,
		public readonly unitOfMeasureId : number
	) {
	}
}
