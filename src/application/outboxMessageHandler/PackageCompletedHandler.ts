import { inject, injectable } from 'tsyringe';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';
import { EventHandlerOutbox } from '@shared/registry/Decorators';

import { PackageCompleted } from '@domain/package/events/PackageCompleted';
import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { IExternalPublisher, IExternalPublisherToken } from '@comunication/contracts/services/IExternalPublisher';
import { PackageCompletedIntegration } from '@/integration/paquete/PackageCreated';

export class PackageCompletedOutbox extends OutboxMessage<PackageCompleted> {
	constructor(content: PackageCompleted) {
		super(content);
	}
}

@injectable()
@EventHandlerOutbox(PackageCompletedOutbox, PackageCompleted)
export class PackageCompletedHandler implements IEventDomainHandler<OutboxMessage<PackageCompleted>> {

	private readonly eventType = 'orders';
	private readonly _externalPublisher: IExternalPublisher;

	constructor(
        @inject(IExternalPublisherToken) externalPublisher: IExternalPublisher
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
