import { injectable, inject } from 'tsyringe';
import { EventHandler } from '@/Common/Mediator/Decorators';
import { OrderItemCompletedEvent } from '@domain/Order/Events/OrderItemCompletedEvent';
import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';
import { OrderExeption } from '../exeptions/OrderExeption';

@injectable()
@EventHandler(OrderItemCompletedEvent)
export class OrderItemCompleted {

	constructor(
        @inject('IOrderRepository') private readonly _orderRepository: IOrderRepository
	) {}

	async handle(event: OrderItemCompletedEvent): Promise<void> {
		try {
			const orderId = event.orderId;

			const order = await this._orderRepository.getByIdAsync(orderId);

			if (!order) {
				throw OrderExeption.notFoundById(orderId);
			}

			order.changeToCompleted();
			await this._orderRepository.updatedAsync(order);
		} catch (e) {
			console.error('Error handling OrderItemCompletedEvent:', e);
		}
	}
}
