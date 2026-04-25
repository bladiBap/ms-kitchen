import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreateCalendarCommand implements IRequest<Result> {
	data!: Result;

	constructor(
		public readonly id: string,
		public readonly clientId: string,
		public readonly mealPlanId: string
	) {
	}
}