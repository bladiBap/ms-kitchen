import { injectable, inject } from 'tsyringe';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';
import { OrderItemCompletedEvent } from '@domain/order/events/OrderItemCompletedEvent';
import { IOrderRepository, IOrderRepositoryToken } from '@domain/order/repositories/IOrderRepository';
import { Transactional } from '@application/common/decorator/Transactional';

@injectable()
export class OrderItemCompletedEventHandler implements IEventDomainHandler<OrderItemCompletedEvent> {

	constructor(
        @inject(IOrderRepositoryToken) private readonly orderRepository: IOrderRepository
	) {}

	@Transactional()
	async handle(event: OrderItemCompletedEvent): Promise<void> {
		const orderId = event.orderId;
		const order = await this.orderRepository.getById(orderId);

		if (!order) {
			return;
		}

		if (order.verifyIfAllItemsCompleted()) {
			order.changeToCompleted();
			await this.orderRepository.update(order);
		}
	}
}
