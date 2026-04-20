import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';
import { ClientError } from '@domain/client/errors/ClientError';

export class Client extends Entity {

	private name: string;

	constructor(id: string, name: string) {
		super(id);
		if (name.trim().length === 0) {
			throw new DomainException(ClientError.nameIsRequired());
		}
		this.name = name;
	}

	public static createNew(name: string): Client {
		return new Client(uuidv4(), name);
	}

	public getName(): string {
		return this.name;
	}

	public setName(name: string): void {
		if (name.trim().length === 0) {
			throw new DomainException(ClientError.nameIsRequired());
		}
		this.name = name;
	}
}
