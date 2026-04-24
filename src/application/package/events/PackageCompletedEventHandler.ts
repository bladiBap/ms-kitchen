import { injectable, inject } from 'tsyringe';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';
import { TransactionalEventHandler } from '@application/common/decorator/Transactional';

import { PackageCompletedEvent } from '@domain/package/events/PackageCompletedEvent';
import { IPackageRepository, IPackageRepositoryToken } from '@domain/package/repositories/IPackageRepository';
import { IOutboxService, IOutboxServiceToken } from '@outbox/service/interface/IOutboxService';
import { DomainEvent } from '@core/abstraction/DomainEvent';
import { PackageAllCompletedOutboxMessage } from '@domain/package/events/outbox/PackageAllCompletedOutboxMessage';
import { OutboxMessage } from '@outbox/model/OutboxMessage';

@injectable()
export class CompletedPackageEventHandler implements IEventDomainHandler<PackageCompletedEvent> {

	constructor(
		@inject(IPackageRepositoryToken) private readonly packageRepository: IPackageRepository,
		@inject(IOutboxServiceToken) private readonly outboxService: IOutboxService<DomainEvent>
	) {
	}

	async addOutboxMessage( lastPackageCompletedId: string, orderId: string ): Promise<void> {
		const packageAllCompletedOutboxMessage = new PackageAllCompletedOutboxMessage(
			lastPackageCompletedId,
			orderId
		);
		const newOutboxMessage = new OutboxMessage<DomainEvent>(
			packageAllCompletedOutboxMessage
		);
		await this.outboxService.create(newOutboxMessage);
	}

	@TransactionalEventHandler()
	async handle(command: PackageCompletedEvent): Promise<void> {
		const { orderId, packageId } = command;
		const isCompleteAllPackages = await this.packageRepository.isCompleteAllPackagesByOrderId(orderId);

		if (isCompleteAllPackages) {
			await this.addOutboxMessage(packageId, orderId);
		}
	}
}
