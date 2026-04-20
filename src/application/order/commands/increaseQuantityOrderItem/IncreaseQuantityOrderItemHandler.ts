import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@/Common/Mediator/Decorators';
import { IncreaseQuantityOrderItemCommand } from './IncreaseQuantityOrderItemCommand';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Result } from '@common/Core/Results/Result';
import { Exception } from '@common/Core/Results/Exception';
import { IOrderItemRepository } from '@domain/Order/Repositories/IOrderItemRepository';
import { IOrderRepository } from '@domain/Order/Repositories/IOrderRepository';

@injectable()
@CommandHandler(IncreaseQuantityOrderItemCommand)
export class IncreaseQuantityOrderItemHandler {

	constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IOrderItemRepository') private readonly _orderItemRepository: IOrderItemRepository,
        @inject('IOrderRepository') private readonly _orderRepository: IOrderRepository,
	) {}

	async execute(command: IncreaseQuantityOrderItemCommand): Promise<Result> {
		await this._unitOfWork.startTransaction();
		try {
			const orderItem = await this._orderItemRepository.getByIdAsync(command.orderItemId);

			if (!orderItem) {
				await this._unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('OrderItem.NotFound', 'Order item with given id not found')
				);
			}

			if (orderItem.isStatusCompleted()) {
				await this._unitOfWork.rollback();
				return Result.failure(
					Exception.InvalidOperation('OrderItem.AlreadyCompleted', 'Order item is already completed')
				);
			}

			const order = await this._orderRepository.getByIdTodayAsync(orderItem.getOrderId());
            
			if (!order) {
				await this._unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('Order.NotFound', 'Order not found for today')
				);
			}

			if (order.isStatusCompleted()) {
				await this._unitOfWork.rollback();
				return Result.failure(
					Exception.InvalidOperation('OrderItem.CompleteFailed', 'Cannot complete item of a completed order')
				);
			}
			const quantityPrepared = command.quantity ?? orderItem.getQuantityPlanned();
			orderItem.increaseQuantityPrepared(quantityPrepared);

			await this._orderItemRepository.updateAsync(orderItem);

			await this._unitOfWork.commit();
			return Result.success();
		} catch (error : any) {
			await this._unitOfWork.rollback();
			return Result.failure(
				Exception.Problem('OrderItem.CompleteFailed', error)
			);
		}
	}
}
