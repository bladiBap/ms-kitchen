import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';

import { IOrderRepository, IOrderRepositoryToken } from '@domain/order/repositories/IOrderRepository';
import { IOrderItemRepository, IOrderItemRepositoryToken } from '@domain/order/repositories/IOrderItemRepository';
import { IncreaseQuantityOrderItemCommand } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { Transactional } from '@application/common/decorator/Transactional';

@injectable()
export class IncreaseQuantityOrderItemHandler {

	constructor(
        @inject(IOrderRepositoryToken) private readonly orderRepository: IOrderRepository,
        @inject(IOrderItemRepositoryToken) private readonly orderItemRepository: IOrderItemRepository,
	) {}

	@Transactional()
	async execute(command: IncreaseQuantityOrderItemCommand): Promise<Result> {
		const orderItem = await this.orderItemRepository.getById(command.orderItemId);

		if (!orderItem) {
			return Result.failure(
				Exception.NotFound('OrderItem.NotFound', 'Order item with given id not found')
			);
		}

		if (orderItem.isStatusCompleted()) {
			return Result.failure(
				Exception.InvalidOperation('OrderItem.AlreadyCompleted', 'Order item is already completed')
			);
		}

		const order = await this.orderRepository.getByIdToday(orderItem.getOrderId());

		if (!order) {
			return Result.failure(
				Exception.NotFound('Order.NotFound', 'Order not found for today')
			);
		}

		if (order.isStatusCompleted()) {
			return Result.failure(
				Exception.InvalidOperation('OrderItem.CompleteFailed', 'Cannot complete item of a completed order')
			);
		}
		const quantityPrepared = command.quantity ?? orderItem.getQuantityPlanned();
		orderItem.increaseQuantityPrepared(quantityPrepared);
		await this.orderItemRepository.update(orderItem);

		return Result.success();
	}
}
