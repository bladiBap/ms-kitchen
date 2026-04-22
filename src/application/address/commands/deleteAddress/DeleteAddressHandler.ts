import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Transactional } from '@application/common/decorator/Transactional';
import { DeleteAddressCommand } from '@application/address/commands/deleteAddress/DeleteAddressCommand';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';

@injectable()
export class DeleteAddressHandler implements IRequestHandler<DeleteAddressCommand, Result> {
	constructor(
        @inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository
	) {}

	@Transactional()
	async handle(request: DeleteAddressCommand): Promise<Result> {
		const addressToDelete = await this.addressRepository.getById(request.id);
		if (!addressToDelete) {;
			return Result.failure(Exception.NotFound('Address.NotFound', `Address with id ${request.id} not found`));
		}
		await this.addressRepository.delete(addressToDelete.getId());
		return Result.success();
	}
}
