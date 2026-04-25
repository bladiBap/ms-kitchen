import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { AddressDeliveryCanceled } from '@/integration/incomming/address/AddressDeliveryCanceled';
import { CancelAddressDeliveryCommand } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryCommand';

@injectable()
export class AddressDeliveryCanceledHandlerConsumer implements IIntegrationMessageConsumer<AddressDeliveryCanceled> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: AddressDeliveryCanceled, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received AddressDeliveryCanceled message for address: ${message.DireccionId}`, cancellationToken);

		const command = new CancelAddressDeliveryCommand(
			message.CalendarioId,
			message.DireccionId
		);

		await this.mediator.send(command);
	}
}