import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { MealPlanEntity } from '@infrastructure/persistence/entities/MealPlanEntity';
import { MealPlanMapper } from '@infrastructure/persistence/mappers/MealPlanMapper';
import { MealPlan } from '@domain/mealPlan/entities/MealPlan';
import { IMealPlanRepository } from '@domain/mealPlan/repositories/IMealPlanRepository';

@injectable()
export class MealPlanRepository implements IMealPlanRepository {

	constructor(
		@inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(mealPlan: MealPlan): Promise<void> {
		const manager = this.emProvider.getManager();
		const mealPlanRepository = manager.getRepository(MealPlanEntity);

		const newMealPlanEntity = MealPlanMapper.toPersistence(mealPlan);
		await mealPlanRepository.save(newMealPlanEntity);
	}
}
