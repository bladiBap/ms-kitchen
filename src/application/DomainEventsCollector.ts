import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';

export class DomainEventsCollector {
	private static events: DomainEvent[] = [];

	static collect(events: DomainEvent[]) {
		if (events.length) {this.events.push(...events);}
	}

	static pullAll(): DomainEvent[] {
		const out = this.events;
		this.events = [];
		return out;
	}
}
