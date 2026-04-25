import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { AddressUpdated } from '@/integration/incomming/address/AddressUpdated';
import { UpdateAddressCommand } from '@application/address/commands/updateAddress/UpdateAddressCommand';

@injectable()
export class AddressUpdatedHandlerConsumer implements IIntegrationMessageConsumer<AddressUpdated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: AddressUpdated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received AddressUpdated message for address: ${message.DireccionId}`, cancellationToken);

		const command = new UpdateAddressCommand(
			message.DireccionId,
			message.Fecha,
			message.NuevaDireccion,
			message.NuevaDireccion,
			message.NuevaLatitud,
			message.NuevaLongitud,
			message.CalendarioId,
			true
		);

		await this.mediator.send(command);
	}
}
