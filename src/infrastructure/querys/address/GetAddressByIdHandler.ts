import { DataSource } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import { Exception } from '@core/results/Exception';
import { ResultWithValue } from '@core/results/Result';

import { AddressDTO } from '@application/address/dto/AddressDto';
import { GetAddressByIdQuery } from '@application/address/query/GetAddressByIdQuery';
import { AddressDTOMapper } from '@application/address/query/mappers/AddressMapper';

import { AddressEntity } from '@infrastructure/persistence/entities/Address';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

@injectable()
export class GetAddressByIdHandler implements IRequestHandler<GetAddressByIdQuery, ResultWithValue<AddressDTO>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(request: GetAddressByIdQuery): Promise<ResultWithValue<AddressDTO>> {
		const addressTable = this.dataSource.getRepository(AddressEntity);

		const address =  await addressTable.findOneBy({ id: request.id });

		if (!address) {
			return ResultWithValue.failureWith<AddressDTO>(
				Exception.NotFound('address_not_found', `Address with id ${request.id} not found`)
			)
		}

		const addressDTO= AddressDTOMapper.toDTO(address);
		return ResultWithValue.successWith<AddressDTO>(addressDTO);
	}
}
