import { inject, injectable } from 'tsyringe';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';

import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { PackageAllCompletedOutboxMessage } from '@domain/package/events/outbox/PackageAllCompletedOutboxMessage';
import { PackageAllCompletedIntegration } from '@/integration/paquete/PackageAllCompletedIntegration';
import { IExternalPublisher, IExternalPublisherToken } from '@comunication/contracts/services/IExternalPublisher';

@injectable()
export class PackageAllCompletedHandler implements IEventDomainHandler<OutboxMessage<PackageAllCompletedOutboxMessage>> {

	private readonly eventType = 'orders';
	private readonly _externalPublisher: IExternalPublisher;

	constructor(
        @inject(IExternalPublisherToken) externalPublisher: IExternalPublisher
	) {
		this._externalPublisher = externalPublisher;
	}

	async handle(message: OutboxMessage<PackageAllCompletedOutboxMessage>): Promise<void> {

		const domainEvent = message.content;
		const packageAllCompleted : PackageAllCompletedIntegration = new PackageAllCompletedIntegration(
			domainEvent.orderId,
			domainEvent.lastPackageCompletedId
		);
		await this._externalPublisher.publishAsync(packageAllCompleted, this.eventType, 'order.completed');
	}
}
