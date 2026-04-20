import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResultWithValue } from '@common/Core/Abstractions/IResult';
import { IClientDeliveredDTO } from '../../dto/dto';

export class GetClientsForDelivered implements IRequest<IResultWithValue<IClientDeliveredDTO[]>> {
	_result!: IResultWithValue<IClientDeliveredDTO[]>;

	constructor(public readonly date : Date) {}
}
