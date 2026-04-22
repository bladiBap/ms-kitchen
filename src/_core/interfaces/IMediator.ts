import { IRequest } from '@core/interfaces/IRequest';
import { DomainEvent } from '@core/abstraction/DomainEvent';
import { OutboxMessage } from '@outbox/model/OutboxMessage';

export interface IMediator {
	send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
	publish(event: DomainEvent): Promise<void>;
	publishOutboxMessage<TEvent extends DomainEvent>(message: OutboxMessage<TEvent>): Promise<void>;
}
