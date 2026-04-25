import { RecipeToPrepareDTO } from '@application/order/dto/RecipeToPrepareDTO';
import { Recipe } from '../entities/Recipe';

export const IRecipeRepositoryToken = Symbol('IRecipeRepository');

export interface IRecipeRepository {
	create(entity: Recipe): Promise<Recipe>;
    getRecipesToPrepare(date: Date): Promise<RecipeToPrepareDTO[]>;
}
