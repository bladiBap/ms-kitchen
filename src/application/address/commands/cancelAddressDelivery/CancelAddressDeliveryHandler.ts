import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';
import { CancelAddressDeliveryCommand } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryCommand';

@injectable()
export class CancelAddressDeliveryHandler implements IRequestHandler<CancelAddressDeliveryCommand, Result> {

	constructor(
		@inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository
	) {}

	async handle(request: CancelAddressDeliveryCommand): Promise<Result> {
		const addressToUpdate = await this.addressRepository.getById(request.addressId);
		if (!addressToUpdate) {
			return Result.failure(
				Exception.NotFound('Address.NotFound', `Address with id ${request.addressId} not found`)
			);
		}

		if (addressToUpdate.getCalendarId() !== request.calendarId) {
			return Result.failure(
				Exception.ValidationError('Address does not belong to the provided calendar.')
			);
		}

		addressToUpdate.setNeedsDelivery(false);
		await this.addressRepository.update(addressToUpdate);

		return Result.success();
	}
}