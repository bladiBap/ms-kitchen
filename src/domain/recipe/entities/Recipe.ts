import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';

import { RecipeError } from '@domain/recipe/errors/RecipeError';
import { RecipeIngredient } from '@domain/recipe/entities/RecipeIngredient';
export class Recipe extends Entity {

	private name : string;
	private instructions : string;
	private ingredients: RecipeIngredient[];

	constructor(id: string, name: string, instructions: string, ingredients: RecipeIngredient[]) {
		super(id);
		if (name.trim().length === 0) {
			throw new DomainException(RecipeError.nameIsRequired());
		}

		this.name = name;
		this.instructions = instructions;
		this.ingredients = ingredients;
	}

	static createNew(id: string, name: string, instructions: string, ingredients: RecipeIngredient[] = []) : Recipe {
		return new Recipe(id, name, instructions, ingredients);
	}

	public addIngredient(ingredientId: string, quantity: number): void {
		const recipeIngredient = RecipeIngredient.createNew(uuidv4(), ingredientId, quantity);
		this.ingredients.push(recipeIngredient);
	}

	public getName() : string {
		return this.name;
	}

	public getInstructions() : string {
		return this.instructions;
	}

	public getIngredients() : RecipeIngredient[] {
		return this.ingredients;
	}
}
