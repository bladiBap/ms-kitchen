import { MealPlan } from '../entities/MealPlan';

export const IMealPlanRepositoryToken = Symbol('IMealPlanRepository');

export interface IMealPlanRepository {
	create(mealPlan: MealPlan): Promise<void>;
}
