import { inject, injectable } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { AddressDeliveryReactivated } from '@/integration/incomming/address/AddressDeliveryReactivated';
import { ReactivateAddressDeliveryCommand } from '@application/address/commands/reactivateAddressDelivery/ReactivateAddressDeliveryCommand';

@injectable()
export class AddressDeliveryReactivatedHandlerConsumer implements IIntegrationMessageConsumer<AddressDeliveryReactivated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: AddressDeliveryReactivated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received AddressDeliveryReactivated message for address: ${message.DireccionId}`, cancellationToken);

		const command = new ReactivateAddressDeliveryCommand(
			message.CalendarioId,
			message.DireccionId
		);

		await this.mediator.send(command);
	}
}