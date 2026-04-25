import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreateMealPlanCommand implements IRequest<Result> {

	data!: Result;

	constructor(
		public readonly id : string,
		public readonly startDate : Date,
		public readonly endDate : Date,
		public readonly durationDays : number,
		public readonly clientId : string,
		public readonly dailyDiet : {
			id: string,
			nDayPlan: number,
			date: Date,
			recipes: {
				id: string,
				quantity: number
			}[]
		}[]
	) {
	}
}
