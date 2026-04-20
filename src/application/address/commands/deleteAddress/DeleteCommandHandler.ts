import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@/Common/Mediator/Decorators';
import { DeleteAddressCommand } from './DeleteAddressCommand';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Result } from '@common/Core/Results/Result';
import { Exception } from '@common/Core/Results/Exception';

import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';


@injectable()
@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler {
	constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IAddressRepository') private readonly _addressRepository: IAddressRepository
	) {}

	async execute( request: DeleteAddressCommand): Promise<Result> {
		await this._unitOfWork.startTransaction();
		try {
			const addressToDelete = await this._addressRepository.getByIdAsync(request.id);
			if (!addressToDelete) {
				await this._unitOfWork.rollback();
				return Result.failure(Exception.NotFound('Address.NotFound', `Address with id ${request.id} not found`));
			}
			await this._addressRepository.deleteAsync(addressToDelete.getId());
			await this._unitOfWork.commit();
			return Result.success();
		} catch (error) {
			console.error('Error deleting address:', error);
			await this._unitOfWork.rollback();
			return Result.failure(Exception.Problem('Address.DeletionFailed', 'Failed to delete address due to an internal error'));
		}
	}
}
