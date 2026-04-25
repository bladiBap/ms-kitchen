import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreateRecipeCommand implements IRequest<Result> {

	data!: Result;

	constructor(
		public readonly id : string,
		public readonly name : string,
		public readonly instructions : string,
		public readonly ingredientsId : { id: string, cantidadValor: number }[]
	) {
	}
}
