import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { DateUtils } from '@shared/utils/Date';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Order } from '@domain/order/entities/Order';
import { IOrderRepository } from '@domain/order/repositories/IOrderRepository';

import { OrderEntity } from '@infrastructure/persistence/entities/OrderEntity';
import { OrderMapper } from '@infrastructure/persistence/mappers/OrderMapper';
import { DomainEventsCollector } from '@application/DomainEventsCollector';

@injectable()
export class OrderRepository implements IOrderRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}
	async create(entity: Order): Promise<Order> {
		const manager = this.emProvider.getManager();
		const orderEntity = OrderMapper.toPersistence(entity);
		const savedOrder = await manager.getRepository(OrderEntity).save(orderEntity);
		return OrderMapper.toDomain(savedOrder);
	}

	async update(entity: Order): Promise<Order> {
		const manager = this.emProvider.getManager();
		const orderEntity = OrderMapper.toPersistence(entity);
		const savedOrder = await manager.getRepository(OrderEntity).save(orderEntity);
		DomainEventsCollector.collect(entity.getDomainEvents());
		return OrderMapper.toDomain(savedOrder);
	}

	async getAll(): Promise<Order[]> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(OrderEntity);


		const orders = await repository.find({
			order: { dateOrdered: 'DESC' }
		});

		return orders.map(order => OrderMapper.toDomain(order));
	}

	async findByDate(date: Date): Promise<Order | null> {
		const manager = this.emProvider.getManager();
		const formattedDate = DateUtils.formatDate(date);
		const order = await manager.getRepository(OrderEntity).findOne({
			where: { dateOrdered: formattedDate }
		});

		if (!order) {
			return null;
		}

		return OrderMapper.toDomain(order);
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(OrderEntity).delete(id);
		return;
	}

	async getById(id: string): Promise<Order | null> {
		const manager = this.emProvider.getManager();

		const orderEntity = await manager.getRepository(OrderEntity).findOne({
			where: { id }
		});

		if (!orderEntity) {return null;}
		return OrderMapper.toDomain(orderEntity);
	}

	async getByIdToday(id: string): Promise<Order | null> {
		const manager = this.emProvider.getManager();
		const today = DateUtils.formatDate(new Date());

		const orderEntity = await manager.getRepository(OrderEntity).findOne({
			where: { id, dateOrdered: today }
		});

		if (!orderEntity) {return null;}
		return OrderMapper.toDomain(orderEntity);
	}
}
