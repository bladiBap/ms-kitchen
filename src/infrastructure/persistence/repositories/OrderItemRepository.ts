import { inject, injectable } from 'tsyringe';

import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';
import { DomainEventsCollector } from '@application/DomainEventsCollector';

import { OrderItem } from '@domain/order/entities/OrderItem';
import { IOrderItemRepository } from '@domain/order/repositories/IOrderItemRepository';

import { OrderItemMapper } from '@infrastructure/persistence/mappers/OrderItemMapper';
import { OrderItemEntity } from '@infrastructure/persistence/entities/OrderItemEntity';


@injectable()
export class OrderItemRepository implements IOrderItemRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}


	async create(entity: OrderItem): Promise<OrderItem> {
		const manager = this.emProvider.getManager();
		const itemEntity = OrderItemMapper.toPersistence(entity);
		const entitySaved = await manager.getRepository(OrderItemEntity).save(itemEntity);
		return OrderItemMapper.toDomain(entitySaved);
	}
	async update(entity: OrderItem): Promise<OrderItem> {
		const manager = this.emProvider.getManager();
		const itemEntity = OrderItemMapper.toPersistence(entity);
		const updatedItem = await manager.getRepository(OrderItemEntity).save(itemEntity);
		DomainEventsCollector.collect(entity.getDomainEvents());
		return OrderItemMapper.toDomain(updatedItem);
	}

	async getAll(): Promise<OrderItem[]> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(OrderItemEntity);
		const items = await repository.find({
			relations: ['order']
		});
		return items.map((item) => OrderItemMapper.toDomain(item));
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(OrderItemEntity).delete(id);
		return;
	}

	async getById(id: string): Promise<OrderItem | null> {
		const manager = this.emProvider.getManager();
		const item = await manager.getRepository(OrderItemEntity).findOne({
			where: { id },
			relations: ['order'],
		});

		if (!item) {return null;}

		const domainItem = OrderItemMapper.toDomain(item);
		return domainItem;
	}
}
