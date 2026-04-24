import { Exception } from '@core/results/Exception';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

export class OrderItemError {

	public static quantityMustBeGreaterThanZero(cantidad: number): Exception {
		return Exception.ValidationError(`Quantity must be greater than zero. Given: ${cantidad}.`);
	}

	public static canNotChangeStatus ( currentStatus: StatusOrder, newStatus: StatusOrder ) : Exception {
		return Exception.ValidationError(`Cannot change order status from ${currentStatus} to ${newStatus}.`);
	}

	public static quantityPreparedExceedsPlanned( quantityPrepared: number, quantityPlanned: number ) : Exception {
		return Exception.ValidationError(`The prepared quantity (${quantityPrepared}) exceeds the planned quantity (${quantityPlanned}).`);
	}

	public static quantityDeliveredExceedsPrepared( quantityDelivered: number, quantityPrepared: number ) : Exception {
		return Exception.ValidationError(`The delivered quantity (${quantityDelivered}) exceeds the prepared quantity (${quantityPrepared}).`);
	}
}
