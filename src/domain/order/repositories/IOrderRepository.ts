import { IRepository } from '@core/interfaces/IRepository';
import { Order } from '../entities/Order';

export interface IOrderRepository extends IRepository<Order> {
    deleteAsync(id: number): Promise<void>;
    findByDateAsync(date: Date): Promise<Order | null>;
    updatedAsync( order: Order): Promise<Order>;
    getByIdTodayAsync(id: number, readOnly?: boolean): Promise<Order | null>;
}
