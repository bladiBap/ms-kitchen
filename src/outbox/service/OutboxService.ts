import { inject, injectable } from 'tsyringe';
import { OutboxMapper } from '@outbox/mappers/OutboxMapper';
import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { OutboxMessageEntity } from '@outbox/persistence/OutboxMessageEntity';
import { IOutboxRepository } from '@outbox/repository/IOutboxRepository';
import { IOutboxService } from '@outbox/service/interface/IOutboxService';
import { IOutboxDatabase } from '@outbox/repository/IOutboxDatabase';

@injectable()
export class OutboxService<TContent> implements IOutboxService<TContent>, IOutboxRepository<TContent> {

	constructor(
        @inject('IOutboxDatabase')private readonly IOutboxDatabase: IOutboxDatabase
	){}

	async create(message: OutboxMessage<TContent>): Promise<void> {
		const entity = OutboxMapper.toEntity(message);
		const manager = this.IOutboxDatabase.getManager();
		await manager.getRepository(OutboxMessageEntity).save(entity);
	}

	async update(outboxMessage: OutboxMessage<TContent>): Promise<void> {
		const manager = this.IOutboxDatabase.getManager();
		const entity = OutboxMapper.toEntity(outboxMessage);
		await manager.getRepository(OutboxMessageEntity).save(entity);
	}

	async getUnprocessed(pageSize: number = 20): Promise<OutboxMessage<TContent>[]> {
		const manager = this.IOutboxDatabase.getManager();
		const entities = await manager.getRepository(OutboxMessageEntity).find({
			where: { processed: false },
			order: { created : 'ASC' },
			take: pageSize
		});
		const messages = entities.map(entity => OutboxMapper.toOutboxMessage<TContent>(entity));
		return messages;
	}
}
