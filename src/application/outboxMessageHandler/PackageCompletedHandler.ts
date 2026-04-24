import { inject, injectable } from 'tsyringe';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';
import { EventHandlerOutbox } from '@shared/registry/Decorators';

import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';
import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { IExternalPublisher, IExternalPublisherToken } from '@comunication/contracts/services/IExternalPublisher';
import { PackageCompletedIntegration } from '@/integration/paquete/PackageCreated';

export class PackageCompletedOutbox extends OutboxMessage<PackageCompletedOutboxMessage> {
	constructor(content: PackageCompletedOutboxMessage) {
		super(content);
	}
}

@injectable()
@EventHandlerOutbox(PackageCompletedOutbox, PackageCompletedOutboxMessage)
export class PackageCompletedHandler implements IEventDomainHandler<OutboxMessage<PackageCompletedOutboxMessage>> {

	private readonly eventType = 'orders';
	private readonly _externalPublisher: IExternalPublisher;

	constructor(
        @inject(IExternalPublisherToken) externalPublisher: IExternalPublisher
	) {
		this._externalPublisher = externalPublisher;
	}

	async handle(message: OutboxMessage<PackageCompletedOutboxMessage>): Promise<void> {

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
