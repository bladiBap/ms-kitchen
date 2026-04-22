import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';
import { UpdateAddressCommand } from '@application/address/commands/updateAddress/UpdateAddressCommand';

@injectable()
export class UpdateAddressHandler implements IRequestHandler<UpdateAddressCommand, Result> {

	constructor(
        @inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository
	) {}

	async handle(request: UpdateAddressCommand): Promise<Result> {
		const addressToUpdate = await this.addressRepository.getById(request.id);
		if (!addressToUpdate) {
			return Result.failure(
				Exception.NotFound('Address.NotFound', `Address with id ${request.id} not found`)
			);
		}
		const location = new Coordinates(
			request.latitude,
			request.longitude
		);

		addressToUpdate.setStreet(request.address);
		addressToUpdate.setReference(request.reference);
		addressToUpdate.setDate(request.date);
		addressToUpdate.setLocation(location);
		addressToUpdate.setNeedsDelivery(request.needsDelivery);

		await this.addressRepository.update(addressToUpdate);
		return Result.success();
	}
}
