import { OutboxMessage } from '@outbox/model/OutboxMessage';

export const IOutboxServiceToken = Symbol.for('IOutboxService');

export interface IOutboxService<TContent> {
    addAsync(message: OutboxMessage<TContent>): Promise<void>;
}
