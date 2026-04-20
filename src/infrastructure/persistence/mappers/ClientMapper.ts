import { Client } from '@domain/client/entities/Client';
import { ClientEntity } from '@infrastructure/persistence/entities/Client';

export class ClientMapper  {

	static toPersistence(item: Client): ClientEntity {
		const itemEntity = new ClientEntity();
		itemEntity.id = item.getId();
		itemEntity.name = item.getName();
		return itemEntity;
	}

	static toDomain(data: ClientEntity): Client {
		return new Client(
			data.id,
			data.name
		);
	}
}
