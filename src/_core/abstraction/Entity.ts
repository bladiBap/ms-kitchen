import { DomainEvent } from '@core/abstraction/DomainEvent';

export abstract class Entity {
	public id: string;
	public createdAt: Date | undefined;
	public updatedAt: Date | undefined;
	private _domainEvents: DomainEvent[];

	constructor(
		id: string,
		createdAt: Date | undefined = undefined,
		updatedAt: Date | undefined = undefined,
	) {
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this._domainEvents = [];
	}

	public getId(): string {
		return this.id;
	}

	public getCreatedAt(): Date | undefined {
		return this.createdAt;
	}

	public getUpdatedAt(): Date | undefined {
		return this.updatedAt;
	}

	public addDomainEvent(domainEvent: DomainEvent): void {
		this._domainEvents.push(domainEvent);
	}

	public clearDomainEvents(): void {
		this._domainEvents = [];
	}

	public getDomainEvents(): DomainEvent[] {
		return this._domainEvents;
	}
}
