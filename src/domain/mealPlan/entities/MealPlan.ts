import { Entity } from '@core/abstraction/Entity';
import { DailyDiet } from './DailyDiet';

export class MealPlan extends Entity {
	private startDate: Date;
	private endDate: Date
	private durationDays: number;
	private clientId: string;
	private dailyDiet: DailyDiet[];

	constructor(
		id: string,
		startDate: Date,
		endDate: Date,
		durationDays: number,
		clientId: string,
		dailyDiet: DailyDiet[] = []
	) {
		super(id);
		this.startDate = startDate;
		this.endDate = endDate;
		this.durationDays = durationDays;
		this.clientId = clientId;
		this.dailyDiet = dailyDiet;
	}

	static createNew(
		id: string,
		startDate: Date,
		endDate: Date,
		durationDays: number,
		clientId: string,
		dailyDiet: DailyDiet[] = []
	): MealPlan {
		return new MealPlan(id, startDate, endDate, durationDays, clientId, dailyDiet);
	}

	public addDailyDiet(dailyDiet: DailyDiet): void {
		this.dailyDiet.push(dailyDiet);
	}

	public getDailyDiet(): DailyDiet[] {
		return this.dailyDiet;
	}

	public getStartDate(): Date {
		return this.startDate;
	}

	public getEndDate(): Date {
		return this.endDate;
	}

	public getDurationDays(): number {
		return this.durationDays;
	}

	public getClientId(): string {
		return this.clientId;
	}
}
