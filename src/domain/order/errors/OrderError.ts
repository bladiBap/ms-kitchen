import { Exception } from '@core/results/Exception';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

export class OrderError {

	public static canNotChangeStatus ( currentStatus: StatusOrder, newStatus: StatusOrder ) : Exception {
		return Exception.Problem(
			'OrderError.canNotChangeStatus',
			`Cannot change order status from ${currentStatus} to ${newStatus}.`
		);
	}

	public static dateCreatedOnMustBeBeforeCurrentDate(dateCreatedOn: Date): Exception {
		return Exception.Problem(
			'OrderError.dateCreatedOnMustBeBeforeCurrentDate',
			`The creation date (${dateCreatedOn.toISOString()}) must be before the current date.`
		);
	}

	public static dateCreatedOnMustBeBeforeDateOrdered(dateCreatedOn: Date, dateOrdered: Date): Exception {
		return Exception.Problem(
			'OrderError.dateCreatedOnMustBeBeforeDateOrdered',
			`The creation date (${dateCreatedOn.toISOString()}) must be before the order date (${dateOrdered.toISOString()}).`
		);
	}

	public static orderItemsNotCompleted(id: string): Exception {
		return Exception.Problem(
			'OrderError.orderItemsNotCompleted',
			`Cannot mark order with id ${id} as completed because not all order items are completed.`
		);
	}

	public static orderItemNotFound(recipeId: string): Exception {
		return Exception.NotFound(
			'OrderError.orderItemNotFound',
			`Order item with recipe id ${recipeId} not found in the order.`
		);
	}
}
