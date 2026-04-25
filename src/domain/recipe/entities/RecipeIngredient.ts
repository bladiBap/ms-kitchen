import { Entity } from '@core/abstraction/Entity';

export class RecipeIngredient extends Entity {
	private ingredientId: string;
	private quantity: number;

	constructor(id: string, ingredientId: string, quantity: number) {
		super(id);
		this.ingredientId = ingredientId;
		this.quantity = quantity;
	}

	static createNew(id: string, ingredientId: string, quantity: number): RecipeIngredient {
		return new RecipeIngredient(id, ingredientId, quantity);
	}

	public getIngredientId(): string {
		return this.ingredientId;
	}

	public getQuantity(): number {
		return this.quantity;
	}
}
