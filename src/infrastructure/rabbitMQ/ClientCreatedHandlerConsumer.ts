import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { ClientCreated } from '@/integration/client/ClientCreated';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { ClientCreatedCommand } from '@application/client/command/ClientCreatedCommand';

@injectable()
export class ClientCreatedHandlerConsumer implements IIntegrationMessageConsumer<ClientCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: ClientCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received ClientCreated message for client: ${message.FirstName}`, cancellationToken);
		const command = new ClientCreatedCommand(message.PatientId, message.FirstName);
		await this.mediator.send(command);
	}
}
