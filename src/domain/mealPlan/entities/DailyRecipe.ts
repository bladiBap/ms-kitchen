import { Entity } from '@core/abstraction/Entity';
import { v4 as uuidv4 } from 'uuid';

export class DailyRecipe extends Entity {
	private recipeId: string;
	private quantity: number;

	constructor(
		id: string,
		recipeId: string,
		quantity: number
	) {
		super(id);
		this.recipeId = recipeId;
		this.quantity = quantity;
	}

	static createNew(recipeId: string, quantity: number): DailyRecipe {
		return new DailyRecipe(uuidv4(), recipeId, quantity);
	}

	public getRecipeId(): string {
		return this.recipeId;
	}

	public getQuantity(): number {
		return this.quantity;
	}
}
