import { inject, injectable } from 'tsyringe';

import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Client } from '@domain/client/entities/Client';
import { IClientRepository } from '@domain/client/repositories/IClientRepository';

import { ClientMapper } from '@infrastructure/persistence/mappers/ClientMapper';
import { ClientEntity } from '@infrastructure/persistence/entities/ClientEntity';

@injectable()
export class ClientRepository implements IClientRepository {
	constructor(
		@inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(entity: Client): Promise<Client> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(ClientEntity);

		const saved = await repo.save(ClientMapper.toPersistence(entity));
		return ClientMapper.toDomain(saved);
	}

	async update(entity: Client): Promise<Client> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(ClientEntity);
		const clientEntity = ClientMapper.toPersistence(entity);
		const updated = await repo.save(clientEntity);
		return ClientMapper.toDomain(updated);
	}
	async getAll(): Promise<Client[]> {
		throw new Error('Method not implemented.');
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(ClientEntity);
		await repo.delete({ id });
	}

	async getById(id: string): Promise<Client | null> {
		const manager = this.emProvider.getManager();
		const entity = await manager.getRepository(ClientEntity).findOne({
			where: { id },
		});
		if (!entity) {
			return null;
		}
		return ClientMapper.toDomain(entity);
	}
}
