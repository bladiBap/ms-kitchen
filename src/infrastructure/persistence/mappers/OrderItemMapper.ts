import { OrderItem } from '@domain/order/entities/OrderItem';
import { OrderItemEntity } from '@infrastructure/persistence/entities/OrderItem';

export class OrderItemMapper {
	static toPersistenceList(items: OrderItem[]): OrderItemEntity[] {
		return items.map(item => this.toPersistence(item));
	}

	static toPersistence(item: OrderItem): OrderItemEntity {
		const itemEntity = new OrderItemEntity();
		itemEntity.id = item.getId();
		itemEntity.orderId = item.getOrderId();
		itemEntity.quantityPlanned = item.getQuantityPlanned();
		itemEntity.quantityPrepared = item.getQuantityPrepared();
		itemEntity.quantityDelivered = item.getQuantityDelivered();
		itemEntity.status = item.getStatus();
		itemEntity.recipeId = item.getRecipeId();
		return itemEntity;
	}

	static toDomainList(data: OrderItemEntity[]): OrderItem[] {
		return data.map(item => this.toDomain(item));
	}

	static toDomain(data: OrderItemEntity): OrderItem {
		return new OrderItem(
			data.id,
			data.orderId,
			data.quantityPlanned,
			data.quantityPrepared,
			data.quantityDelivered,
			data.recipeId,
			data.status
		);
	}
}
