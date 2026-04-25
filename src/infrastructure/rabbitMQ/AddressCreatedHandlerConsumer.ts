import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { AddressCreated } from '@/integration/incomming/address/AddressCreated';
import { CreateAddressCommand } from '@application/address/commands/createAddress/CreateAddressCommand';

@injectable()
export class AddressCreatedHandlerConsumer implements IIntegrationMessageConsumer<AddressCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: AddressCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received AddressCreated message for address: ${message.DireccionId}`, cancellationToken);

		const command = new CreateAddressCommand(
			message.Fecha,
			message.Direccion,
			message.Direccion,
			message.Latitud,
			message.Longitud,
			message.CalendarioId
		);

		await this.mediator.send(command);
	}
}
