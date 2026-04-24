import { DomainEvent } from '@core/abstraction/DomainEvent';

export class PackageCompletedEvent extends DomainEvent {
	constructor(
		public readonly orderId: string,
		public readonly packageId: string,
	) {
		super();
	}
}
