import { IRequest } from '@core/interfaces/IRequest';
import { ResultWithValue } from '@core/results/Result';
import { OrderDTO } from '@application/order/dto/OrderDTO';

export class GetAllOrdersQuery implements IRequest<ResultWithValue<OrderDTO[]>> {
	data!: ResultWithValue<OrderDTO[]>;
}
