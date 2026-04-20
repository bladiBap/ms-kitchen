import { Order } from '@domain/order/entities/Order';
import { OrderEntity } from '@infrastructure/persistence/entities/Order';

import { OrderItem } from '@domain/order/entities/OrderItem';
import { OrderItemEntity } from '@infrastructure/persistence/entities/OrderItem';

export class OrderMapper {

	static toPersistenceList(orders: Order[]): OrderEntity[] {
		return orders.map(order => this.toPersistence(order));
	}

	static toPersistence(order: Order): OrderEntity {

		const orderItemsEntities: OrderItemEntity[] = order.getListOrderItems()?.map(item => {
			const itemEntity = new OrderItemEntity();
			itemEntity.id = item.getId();
			itemEntity.orderId = item.getOrderId();
			itemEntity.quantityPlanned = item.getQuantityPlanned();
			itemEntity.quantityPrepared = item.getQuantityPrepared();
			itemEntity.quantityDelivered = item.getQuantityDelivered();
			itemEntity.status = item.getStatus();
			itemEntity.recipeId = item.getRecipeId();
			return itemEntity;
		});

		const orderEntity = new OrderEntity();
		
		orderEntity.id = order.getId();
		orderEntity.dateOrdered = order.getDateOrdered();
		orderEntity.dateCreatedOn = order.getDateCreatedOn();
		orderEntity.status = order.getStatus();
		orderEntity.orderItems = orderItemsEntities || [];

		orderEntity.orderItems.forEach(item => {
			item.order = orderEntity;
		});

		return orderEntity;
	}

	static toDomainList(data: OrderEntity[]): Order[] {
		const array: Order[] = [];
		data.forEach(item => {
			array.push(this.toDomain(item));
		});
		return array;
	}

	static toDomain(data: OrderEntity): Order {

		const orderItems: OrderItem[] = data.orderItems?.map(item => {
			return new OrderItem(
				item.id,
				item.orderId,
				item.quantityPlanned,
				item.quantityPrepared,
				item.quantityDelivered,
				item.recipeId,
				item.status
			);
		});

		const order = new Order(
			data.id,
			data.dateOrdered,
			data.dateCreatedOn,
			data.status,
			orderItems || []
		);
		return order;
	}
}
