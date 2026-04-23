import { injectable, inject } from 'tsyringe';
import { CodeGenerator } from '@shared/utils/Code';
import { IEventDomainHandler } from '@core/interfaces/IEventDomainHandler';
import { Transactional } from '@application/common/decorator/Transactional';

import { Package } from '@domain/package/entities/Package';
import { PackageItem } from '@domain/package/entities/PackageItem';
import { StatusPackage } from '@domain/package/types/StatusPackage';
import { OrderCompletedEvent } from '@domain/order/events/OrderCompletedEvent';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';
import { IPackageRepository, IPackageRepositoryToken } from '@domain/package/repositories/IPackageRepository';
import { IDailyAllocationRepository, IDailyAllocationRepositoryToken } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

@injectable()
export class CreatePackageEventHandler implements IEventDomainHandler<OrderCompletedEvent> {

	constructor(
		@inject(IPackageRepositoryToken) private readonly packageRepository: IPackageRepository,
		@inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository,
		@inject(IDailyAllocationRepositoryToken) private readonly dailyAllocationRepository: IDailyAllocationRepository
	) {
	}

	@Transactional()
	async handle(command: OrderCompletedEvent): Promise<void> {
		const { orderId, dateOrder } = command;

		const clientsIds = await this.dailyAllocationRepository.getClientsIdsByDate(dateOrder);

		for (const clientId of clientsIds) {

			const dailyAllocation = await this.dailyAllocationRepository.getDailyAllocation(clientId, dateOrder);
			const address = await this.addressRepository.getAddressByDateAndClientId(clientId, dateOrder);

			if (!dailyAllocation || !address || !address.getNeedsDelivery()) {
				continue;
			}

			const newPackage = Package.createNew(orderId, CodeGenerator.generateCode(), StatusPackage.CREATED, clientId, address.getId(), dateOrder);

			for (const line of dailyAllocation.getLines()) {
				const packageItem = PackageItem.createNew(line.getRecipeId(), newPackage.getId(), line.getQuantityNeeded());
				newPackage.addPackageItem(packageItem);
				line.updateQuantityPackaged(line.getQuantityNeeded());
			}

			await this.packageRepository.create(newPackage);
			await this.addressRepository.update(address);
		}
	}
}
