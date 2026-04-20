import { RecipeRawDTO } from '@application/order/dto/OrderRawDTO';
import { IRecipeRepository } from '@domain/Recipe/Repositories/IRecipeRepository';
import { Recipe } from '@domain/Recipe/Entities/Recipe';
import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

@injectable()
export class RecipeRepository implements IRecipeRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	getByIdsAsync(ids: number[], readOnly?: boolean): Promise<Recipe[]> {
		console.log(`Fetching recipes with ids: ${ids.join(', ')} (readOnly: ${readOnly})`);
		throw new Error('Method not implemented.');
	}

	async getRecipesToPrepare(date: Date): Promise<RecipeRawDTO[]> {
		const manager = this.emProvider.getManager();

		date.setHours(0, 0, 0, 0);

		const result: RecipeRawDTO[] = await manager.query(`
            SELECT
                ddr."recipeId" AS "recipeId",
                COUNT(ddr."recipeId") AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" c ON c."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."calendarId" = c."id"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1 AND dd."date" = $1
                AND $1::date BETWEEN mp."startDate" AND mp."endDate"
            GROUP BY ddr."recipeId"; `,
		[date]
		);

		return result;
	}

	getByIdAsync(id: number, readOnly?: boolean): Promise<Recipe | null> {
		console.log(`Fetching recipe with id: ${id} (readOnly: ${readOnly})`);
		throw new Error('Method not implemented.');
	}

	addAsync(entity: Recipe): Promise<void> {
		console.log(`Adding recipe with id: ${entity.getId()}`);
		throw new Error('Method not implemented.');
	}
}
