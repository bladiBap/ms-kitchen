import 'reflect-metadata';
import { DateUtils } from '@/Common/Utils/Date';
import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';
import { Order } from '@domain/Order/Entities/Order';
import { Order as OrderEntity } from '../PersistenceModel/Entities/Order';

import { OrderMapper } from '../DomainModel/Config/OrderMapper';
import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

@injectable()
export class OrderRepository implements IOrderRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async findByDateAsync(date: Date): Promise<Order | null> {
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

	async deleteAsync(id: number): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(OrderEntity).delete(id);
		return;
	}

	async getByIdAsync(id: number): Promise<Order | null> {
		const manager = this.emProvider.getManager();

		const orderEntity = await manager.getRepository(OrderEntity).findOne({
			where: { id }
		});

		if (!orderEntity) {return null;}
		return OrderMapper.toDomain(orderEntity);
	}

	async getByIdTodayAsync(id: number, readOnly: boolean = false): Promise<Order | null> {
		console.log(`Fetching order with id: ${id} (readOnly: ${readOnly})`);
		const manager = this.emProvider.getManager();
		const today = DateUtils.formatDate(new Date());

		const orderEntity = await manager.getRepository(OrderEntity).findOne({
			where: { id, dateOrdered: today }
		});

		if (!orderEntity) {return null;}
		return OrderMapper.toDomain(orderEntity);
	}

	async addAsync(entity: Order): Promise<void> {
		const manager = this.emProvider.getManager();
		const orderEntity = OrderMapper.toPersistence(entity);
		await manager.getRepository(OrderEntity).save(orderEntity);
	}

	async updatedAsync(order: Order): Promise<Order> {
		const manager = this.emProvider.getManager();
		const orderEntity = OrderMapper.toPersistence(order);
		await manager.getRepository(OrderEntity).save(orderEntity);
		return order;
	}
}
