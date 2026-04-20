import { inject, injectable } from 'tsyringe';
import { EventHandlerOutbox } from '@common/Mediator/Decorators';
import { PackageCompleted } from '@domain/Package/Events/PackageCompleted';
import { OutboxMessage } from '@outbox/Model/OutboxMessage';
import { IExternalPublisher } from '@comunication/Contracts/Services/IExternalPublisher';
import { PackageCompletedIntegration } from '@/Integration/Paquete/PackageCreated';
import { IEventHandler } from '@common/Mediator/Mediator';

export class PackageCompletedOutbox extends OutboxMessage<PackageCompleted> {
	constructor(content: PackageCompleted) {
		super(content);
	}
}

@injectable()
@EventHandlerOutbox(PackageCompletedOutbox, PackageCompleted)
export class PackageCompletedHandler implements IEventHandler<OutboxMessage<PackageCompleted>> {

	private readonly eventType = 'orders';
	private readonly _externalPublisher: IExternalPublisher;

	constructor(
        @inject('IExternalPublisher') externalPublisher: IExternalPublisher
	) {
		this._externalPublisher = externalPublisher;
	}

	async handle(message: OutboxMessage<PackageCompleted>): Promise<void> {

		const domainEvent = message.content;
		const packageCompleted : PackageCompletedIntegration = new PackageCompletedIntegration(
			domainEvent.customerId,
			domainEvent.deliveryDate,
			domainEvent.deliveryLocation,
			domainEvent.createdAt,
			domainEvent.items
		);
		await this._externalPublisher.publishAsync(packageCompleted, this.eventType, 'order.created'); 
	}
}