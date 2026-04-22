import { AddressDTO } from '@application/address/dto/AddressDto';
import { IRequest } from '@core/interfaces/IRequest';
import { ResultWithValue } from '@core/results/Result';

export class GetAddressByIdQuery implements IRequest<ResultWithValue<AddressDTO>> {
	data!: ResultWithValue<AddressDTO>;

	constructor(public readonly id : string) {}
}
