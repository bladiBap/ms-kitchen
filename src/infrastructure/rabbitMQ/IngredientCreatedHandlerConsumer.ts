import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { IngredientCreated } from '@/integration/incomming/ingredient/IngredientCreated';
import { CreateIngredientCommand } from '@application/ingredient/commands/createIngredient/CreateIngredientCommand';

@injectable()
export class IngredientCreatedHandlerConsumer implements IIntegrationMessageConsumer<IngredientCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: IngredientCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received IngredientCreated message for ingredient: ${message.Nombre}`, cancellationToken);
		const command = new CreateIngredientCommand(message.IngredienteId, message.Nombre, message.UnidadId);
		await this.mediator.send(command);
	}
}
