import { Recipe } from '@domain/recipe/entities/Recipe';
import { IRepository } from '@core/interfaces/IRepository';

export interface IRecipeRepository extends IRepository<Recipe> {
    getByIdsAsync(ids: number[], readOnly?: boolean): Promise<Recipe[]>;
    getRecipesToPrepare(date: Date): Promise<{recipeId: number,quantity: number}[]>;
}
