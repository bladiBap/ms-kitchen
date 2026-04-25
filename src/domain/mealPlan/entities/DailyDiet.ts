import { Entity } from '@core/abstraction/Entity';
import { DailyRecipe } from './DailyRecipe';

export class DailyDiet extends Entity {
	private nDayPlan: number;
	private date: Date;
	private recipes: DailyRecipe[];
	constructor(
		id: string,
		nDayPlan: number,
		date: Date,
		recipes: DailyRecipe[] = []
	) {
		super(id);
		this.nDayPlan = nDayPlan;
		this.date = date;
		this.recipes = recipes;
	}

	static createNew(
		id: string,
		nDayPlan: number,
		date: Date,
		recipes: DailyRecipe[] = []
	): DailyDiet {
		return new DailyDiet(id, nDayPlan, date, recipes);
	}

	public addRecipe(recipeId: string, quantity: number): void {
		const newRecipe = DailyRecipe.createNew(recipeId, quantity);
		this.recipes.push(newRecipe);
	}

	public getRecipes(): DailyRecipe[] {
		return this.recipes;
	}

	public getDate(): Date {
		return this.date;
	}

	public getNDayPlan(): number {
		return this.nDayPlan;
	}
}
