import { EntityManager } from 'typeorm';
import { IRepository } from '@core/interfaces/IRepository';
import { OrderItem } from '@domain/order/entities/OrderItem';

export interface IOrderItemRepository extends IRepository<OrderItem> {
    deleteAsync(id: number): Promise<void>;
    updateAsync(entity: OrderItem, em?: EntityManager): Promise<OrderItem>;
}
