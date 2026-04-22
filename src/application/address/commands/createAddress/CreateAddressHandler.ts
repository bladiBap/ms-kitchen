import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Transactional } from '@application/common/decorator/Transactional';
import { CreateAddressCommand } from '@application/address/commands/createAddress/CreateAddressCommand';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';

@injectable()
export class CreateAddressHandler implements IRequestHandler<CreateAddressCommand, Result> {
	constructor(
        @inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository,
	) {}

	@Transactional()
	async handle(createAddressCommand: CreateAddressCommand): Promise<Result> {
		const location = new Coordinates(
			createAddressCommand.latitude,
			createAddressCommand.longitude
		);
		const address = Address.createNew(
			createAddressCommand.calendarId,
			createAddressCommand.date,
			createAddressCommand.address,
			createAddressCommand.reference,
			location
		);
		await this.addressRepository.create(address);
		return Result.success();
	}
}
