import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@/Common/Mediator/Decorators';
import { UpdateAddressCommand } from './UpdateAddressCommand';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Result } from '@common/Core/Results/Result';
import { Exception } from '@common/Core/Results/Exception';

import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';
import { Address } from '@domain/Address/Entities/Address';
import { Coordinates } from '@domain/Address/ValuesObjects/Coordinates';

@injectable()
@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler {
	constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IAddressRepository') private readonly _addressRepository: IAddressRepository
	) {}

	async execute( request: UpdateAddressCommand): Promise<Result> {
		await this._unitOfWork.startTransaction();
		try {

			const addressToUpdate = await this._addressRepository.getByIdAsync(request.id);
			if (!addressToUpdate) {
				await this._unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('Address.NotFound', `Address with id ${request.id} not found`)
				);
			}
			const location = new Coordinates(
				request.latitude,
				request.longitude
			);
			const address = new Address(
				request.id,
				request.calendarId,
				request.date,
				request.address,
				request.reference,
				location
			);
			await this._addressRepository.updateAsync(address);
			await this._unitOfWork.commit();
			return Result.success();
		} catch (error) {
			console.error('Error updating address:', error);
			await this._unitOfWork.rollback();
			return Result.failure(Exception.Problem('Address.UpdateFailed', 'Failed to update address due to an internal error'));
		}
	}
}
