import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResultWithValue } from '@common/Core/Abstractions/IResult';
import { AddressDTO } from '../dto/AddressDto';

export class GetAddressById implements IRequest<IResultWithValue<AddressDTO>> {
	_result!: IResultWithValue<AddressDTO>;

	constructor(public readonly id : number) {}
}
