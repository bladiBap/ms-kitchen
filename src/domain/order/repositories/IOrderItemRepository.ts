import { IRepository } from '@core/interfaces/IRepository';
import { OrderItem } from '@domain/order/entities/OrderItem';

export const IOrderItemRepositoryToken = Symbol('IOrderItemRepository');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOrderItemRepository extends IRepository<OrderItem> {
}
