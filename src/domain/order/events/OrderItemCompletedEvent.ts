import { DomainEvent } from '@core/abstraction/DomainEvent';

export class OrderItemCompletedEvent extends DomainEvent {
	constructor(public readonly orderId: string) { super(); }
}
