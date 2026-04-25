import { MealPlan } from '@domain/mealPlan/entities/MealPlan';
import { MealPlanEntity } from '@infrastructure/persistence/entities/MealPlanEntity';
import { ClientEntity } from '../entities/ClientEntity';
import { DayliDietEntity } from '../entities/DayliDietEntity';
import { DayliDietRecipeEntity } from '../entities/DayliDietRecipeEntity';
import { RecipeEntity } from '../entities/RecipeEntity';

export class MealPlanMapper {

	static toDomain(entity: MealPlanEntity): MealPlan {
		const mealPlan = MealPlan.createNew(
			entity.id,
			entity.startDate,
			entity.endDate,
			entity.durationDays,
			entity.client.id
		);

		return mealPlan;
	}

	static toPersistence(domain: MealPlan): MealPlanEntity {
		const client = new ClientEntity();
		client.id = domain.getClientId();

		const mealPlanEntity = new MealPlanEntity();
		mealPlanEntity.id = domain.id;
		mealPlanEntity.startDate = domain.getStartDate();
		mealPlanEntity.endDate = domain.getEndDate();
		mealPlanEntity.durationDays = domain.getDurationDays();
		mealPlanEntity.client = client;

		for (const dailyDiet of domain.getDailyDiet()) {
			const dailyDietEntity = new DayliDietEntity();
			dailyDietEntity.id = dailyDiet.id;
			dailyDietEntity.nDayPlan = dailyDiet.getNDayPlan();
			dailyDietEntity.date = dailyDiet.getDate();
			dailyDietEntity.mealPlan = mealPlanEntity;

			for (const recipeDiet of dailyDiet.getRecipes()) {
				const recipe = new RecipeEntity();
				recipe.id = recipeDiet.id;

				const dailyRecipeEntity = new DayliDietRecipeEntity();
				dailyRecipeEntity.quantity = recipeDiet.getQuantity();
				dailyRecipeEntity.dayliDiet = dailyDietEntity;
				dailyRecipeEntity.recipe = recipe;
			}
		}


		return mealPlanEntity;
	}
}
