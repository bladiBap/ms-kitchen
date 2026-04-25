import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { RecipeCreated } from '@/integration/incomming/recipe/RecipeCreated';
import { CreateRecipeCommand } from '@application/recipe/commands/createRecipe/CreateRecipeCommand';

@injectable()
export class RecipeCreatedHandlerConsumer implements IIntegrationMessageConsumer<RecipeCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: RecipeCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received RecipeCreated message for recipe: ${message.Nombre}`, cancellationToken);
		const ingredients = message.IngredientesId.map(ingredient => {
			return { id: ingredient.Id, cantidadValor: ingredient.CantidadValor };
		});
		const command = new CreateRecipeCommand(message.RecetaId, message.Nombre, message.Instrucciones, ingredients);
		await this.mediator.send(command);
	}
}
