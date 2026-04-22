import { Recipe } from '@domain/recipe/entities/Recipe';
import { IRepository } from '@core/interfaces/IRepository';
import { RecipeToPrepareDTO } from '@application/order/dto/RecipeToPrepareDTO';

export const IRecipeRepositoryToken = Symbol('IRecipeRepository');

export interface IRecipeRepository extends IRepository<Recipe> {
    getRecipesToPrepare(date: Date): Promise<RecipeToPrepareDTO[]>;
}
