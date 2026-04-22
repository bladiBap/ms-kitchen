import { injectable, inject } from 'tsyringe';
import { Mediator } from '@shared/mediator/Mediator';
import { DomainEvent } from '@core/abstraction/DomainEvent';

import { Transactional } from '@application/common/decorator/Transactional';
import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { IOutboxRepository, IOutboxRepositoryToken } from '@outbox/repository/IOutboxRepository';

@injectable()
export class OutboxProcessor<TContent extends DomainEvent> {
	constructor(
        @inject(IOutboxRepositoryToken) private readonly outboxRepo: IOutboxRepository<TContent>,
        @inject(Mediator) private readonly mediator: Mediator
	) {}

	public async process(): Promise<void> {
		const messages = await this.outboxRepo.getUnprocessed(10);
		console.log(`Procesando ${messages.length} mensajes de outbox...`);

		if (messages.length === 0) {
			return;
		}
		for (const item of messages) {
			await this.publishOutboxMessage(item);
		}
	}

	@Transactional()
	private async publishOutboxMessage(outboxMessage: OutboxMessage<TContent>): Promise<void> {
		await this.mediator.publishOutboxMessage(outboxMessage);
		outboxMessage.markAsProcessed();
		await this.outboxRepo.update(outboxMessage);
		console.log(`Mensaje ${outboxMessage.id} procesado exitosamente.`);
	}
}
