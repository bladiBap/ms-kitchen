import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Recipe } from '@domain/recipe/entities/Recipe';
import { IRecipeRepository } from '@domain/recipe/repositories/IRecipeRepository';
import { RecipeToPrepareDTO } from '@application/order/dto/RecipeToPrepareDTO';

@injectable()
export class RecipeRepository implements IRecipeRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(entity: Recipe): Promise<Recipe> {
		console.log(`Creating recipe with id: ${entity.getId()}`);
		throw new Error('Method not implemented.');
	}

	async update(entity: Recipe): Promise<Recipe> {
		console.log(`Updating recipe with id: ${entity.getId()}`);
		throw new Error('Method not implemented.');
	}
	async delete(id: string): Promise<void> {
		console.log(`Deleting recipe with id: ${id}`);
		throw new Error('Method not implemented.');
	}
	async getAll(): Promise<Recipe[]> {
		return this.emProvider.getManager().find(Recipe);
	}

	async getRecipesToPrepare(date: Date): Promise<RecipeToPrepareDTO[]> {
		const manager = this.emProvider.getManager();

		date.setHours(0, 0, 0, 0);

		const result: RecipeToPrepareDTO[] = await manager.query(`
            SELECT
                ddr."recipeId" AS "recipeId",
                COUNT(ddr."recipeId") AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" c ON c."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."calendarId" = c."id"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1 AND dd."date" = $1
                AND $1::date BETWEEN mp."startDate" AND mp."endDate" AND a."needsDelivery" = true
            GROUP BY ddr."recipeId"; `,
		[date]
		);

		return result;
	}

	async getById(id: string, readOnly?: boolean): Promise<Recipe | null> {
		console.log(`Fetching recipe with id: ${id} (readOnly: ${readOnly})`);
		return null;
	}
}
