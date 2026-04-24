import 'reflect-metadata';
import { DomainEvent } from '@core/abstraction/DomainEvent';


export class PackageAllCompletedOutboxMessage extends DomainEvent {
	lastPackageCompletedId: string;
	orderId: string;

	constructor(
		lastPackageCompletedId: string,
		orderId: string
	) {
		super();
		this.lastPackageCompletedId = lastPackageCompletedId;
		this.orderId = orderId;
	}
}
