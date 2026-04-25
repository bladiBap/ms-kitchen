import { inject, injectable } from 'tsyringe';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';
import { Result } from '@core/results/Result';

import { MealPlan } from '@domain/mealPlan/entities/MealPlan';
import { DailyDiet } from '@domain/mealPlan/entities/DailyDiet';
import { IMealPlanRepository } from '@domain/mealPlan/repositories/IMealPlanRepository';
import { IMealPlanRepositoryToken } from '@domain/mealPlan/repositories/IMealPlanRepository';

import { Transactional } from '@application/common/decorator/Transactional';
import { CreateMealPlanCommand } from '@application/mealPlan/commands/createMealPlan/CreateMealPlanCommand';

@injectable()
export class CreateMealPlanHandler implements IRequestHandler <CreateMealPlanCommand, Result> {

	constructor(
		@inject(IMealPlanRepositoryToken) private readonly mealPlanRepository: IMealPlanRepository
	) {}

	@Transactional()
	async handle(createMealPlanCommand: CreateMealPlanCommand): Promise<Result> {
		const { id, clientId, startDate, endDate, durationDays, dailyDiet } = createMealPlanCommand;

		const newMealPlan = MealPlan.createNew(id, startDate, endDate, durationDays, clientId);

		for (const dieta of dailyDiet) {
			const dailyDietEntity = DailyDiet.createNew(dieta.id, dieta.nDayPlan, dieta.date);
			for (const receta of dieta.recipes) {
				dailyDietEntity.addRecipe(receta.id, receta.quantity);
			}
			newMealPlan.addDailyDiet(dailyDietEntity);
		}

		await this.mealPlanRepository.create(newMealPlan);
		return Result.success();
	}
}
