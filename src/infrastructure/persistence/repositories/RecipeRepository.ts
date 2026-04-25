import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Recipe } from '@domain/recipe/entities/Recipe';
import { IRecipeRepository } from '@domain/recipe/repositories/IRecipeRepository';
import { RecipeToPrepareDTO } from '@application/order/dto/RecipeToPrepareDTO';
import { RecipeEntity } from '../entities/RecipeEntity';
import { RecipeMapper } from '../mappers/RecipeMapper';

@injectable()
export class RecipeRepository implements IRecipeRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(entity: Recipe): Promise<Recipe> {
		const manager = this.emProvider.getManager();
		const recipeRepository = manager.getRepository(RecipeEntity);
		await recipeRepository.save(RecipeMapper.toPersistence(entity));
		return entity;
	}

	async getRecipesToPrepare(date: Date): Promise<RecipeToPrepareDTO[]> {
		const manager = this.emProvider.getManager();
		const dateStr = date.toISOString().split('T')[0];

		const result: RecipeToPrepareDTO[] = await manager.query(`
            SELECT
                ddr."recipeId" AS "recipeId",
				COALESCE(SUM(ddr."quantity"), 0)::int AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" c ON c."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."id" = c."mealPlanId"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1 AND dd."date" = $1
                AND $1::date BETWEEN mp."startDate" AND mp."endDate" AND a."needsDelivery" = true
            GROUP BY ddr."recipeId"; `,
			[dateStr]
		);

		return result;
	}
}
