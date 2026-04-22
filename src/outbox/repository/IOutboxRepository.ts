import { OutboxMessage } from '@outbox/model/OutboxMessage';

export const IOutboxRepositoryToken = Symbol('IOutboxRepository');

export interface IOutboxRepository<TContent> {
    update (outboxMessage: OutboxMessage<TContent>): Promise<void>;
    getUnprocessed (pageSize: number): Promise<OutboxMessage<TContent>[]>;
}
