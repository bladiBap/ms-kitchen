import { DomainEvent } from '@core/abstraction/DomainEvent';

export class OrderCompletedEvent extends DomainEvent {
	constructor(
		public readonly orderId: string,
		public readonly dateOrder: Date
	) {
		super();
	}
}
