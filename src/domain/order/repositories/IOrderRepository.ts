import { IRepository } from '@core/interfaces/IRepository';
import { Order } from '@domain/order/entities/Order';

export const IOrderRepositoryToken = Symbol('IOrderRepository');

export interface IOrderRepository extends IRepository<Order> {
    findByDate(date: Date): Promise<Order | null>;
    getByIdToday(id: string): Promise<Order | null>;
}
