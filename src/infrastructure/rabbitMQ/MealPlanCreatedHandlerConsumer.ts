import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { MealPlanCreated } from '@/integration/incomming/mealPlan/MealPlanCreated';
import { CreateMealPlanCommand } from '@application/mealPlan/commands/createMealPlan/CreateMealPlanCommand';

@injectable()
export class MealPlanCreatedHandlerConsumer implements IIntegrationMessageConsumer<MealPlanCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: MealPlanCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received MealPlanCreated message for plan: ${message.PlanId}`, cancellationToken);
		const dieta = message.Dietas.map(dieta => {
			const recetasMap = new Map<string, number>();
			dieta.Recetas.forEach(receta => {
				recetasMap.set(receta.RecetaId, (recetasMap.get(receta.RecetaId) || 0) + 1);
			});

			const nDay = Math.floor((new Date(dieta.FechaConsumo).getTime() - new Date(message.FechaInicio).getTime()) / (1000 * 60 * 60 * 24)) + 1;
			return {
				id: dieta.DietaId,
				nDayPlan: nDay,
				date: dieta.FechaConsumo,
				recipes: Array.from(recetasMap.entries()).map(([recetaId, quantity]) => ({
					id: recetaId,
					quantity
				}))
			};
		});

		const command = new CreateMealPlanCommand(
			message.PlanId,
			message.FechaInicio,
			new Date(new Date(message.FechaInicio).getTime() + (message.Duracion - 1) * 24 * 60 * 60 * 1000),
			message.Duracion,
			message.PacienteId,
			dieta
		);

		await this.mediator.send(command);
	}
}
