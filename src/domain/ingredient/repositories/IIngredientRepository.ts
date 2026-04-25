import { Ingredient } from '@domain/ingredient/entities/Ingredient';

export const IIngredientRepositoryToken = Symbol('IIngredientRepository');

export interface IIngredientRepository {
	create(ingredient: Ingredient): Promise<void>;
	getById(id: string): Promise<Ingredient | null>;
}
