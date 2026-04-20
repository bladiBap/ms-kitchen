import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@/Common/Mediator/Decorators';
import { CreateAddressCommand } from './CreateAddressCommand';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Result } from '@common/Core/Results/Result';
import { Exception } from '@common/Core/Results/Exception';

import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';
import { Address } from '@domain/Address/Entities/Address';
import { Coordinates } from '@domain/Address/ValuesObjects/Coordinates';

@injectable()
@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler {
	constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IAddressRepository') private readonly _addressRepository: IAddressRepository,
	) {}

	async execute( createAddressCommand: CreateAddressCommand): Promise<Result> {
		await this._unitOfWork.startTransaction();
		try {
			const location = new Coordinates(
				createAddressCommand.latitude,
				createAddressCommand.longitude
			);
			const address = new Address(
				0,
				createAddressCommand.calendarId,
				createAddressCommand.date,
				createAddressCommand.address,
				createAddressCommand.reference,
				location
			);
			await this._addressRepository.addAsync(address);
			await this._unitOfWork.commit();
			return Result.success();
		} catch (error) {
			console.error('Error creating address:', error);
			await this._unitOfWork.rollback();
			return Result.failure(Exception.Problem('Address.CreationFailed', 'Failed to create address due to an internal error'));
		}
	}
}
