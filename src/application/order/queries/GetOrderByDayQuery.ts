import { OrderDTO } from '@application/order/dto/OrderDTO';
import { IRequest } from '@core/interfaces/IRequest';
import { ResultWithValue } from '@core/results/Result';

export class GetOrderByDay implements IRequest<ResultWithValue<OrderDTO>> {
	data!: ResultWithValue<OrderDTO>;

	constructor(public readonly date: Date) {
	}
}
