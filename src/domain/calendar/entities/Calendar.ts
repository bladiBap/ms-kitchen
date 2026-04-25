import { Entity } from '@core/abstraction/Entity';

export class Calendar extends Entity {
	private clientId: string;
	private mealPlanId: string;

	constructor(id: string, clientId: string, mealPlanId: string) {
		super(id);
		this.clientId = clientId;
		this.mealPlanId = mealPlanId;
	}

	static createNew(id: string, clientId: string, mealPlanId: string): Calendar {
		return new Calendar(id, clientId, mealPlanId);
	}

	getClientId(): string {
		return this.clientId;
	}

	getMealPlanId(): string {
		return this.mealPlanId;
	}
}
