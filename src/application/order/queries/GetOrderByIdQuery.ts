import { OrderDTO } from '@application/order/dto/OrderDTO';
import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResultWithValue } from '@common/Core/Abstractions/IResult';

export class GetOrderById implements IRequest<IResultWithValue<OrderDTO>> {
	_result!: IResultWithValue<OrderDTO>;

	constructor(public readonly id: number) {
	}
}
