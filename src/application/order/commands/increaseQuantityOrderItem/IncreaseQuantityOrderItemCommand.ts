import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResult } from '@common/Core/Abstractions/IResult';

export class IncreaseQuantityOrderItemCommand implements IRequest<IResult> {
	_result!: IResult;

	constructor(public readonly orderItemId: number, public readonly quantity?: number) {}
}
