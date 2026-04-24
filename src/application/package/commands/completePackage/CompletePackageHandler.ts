import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';

import { Exception } from '@core/results/Exception';
import { DomainEvent } from '@core/abstraction/DomainEvent';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { IOutboxService, IOutboxServiceToken } from '@outbox/service/interface/IOutboxService';

import { Transactional } from '@application/common/decorator/Transactional';
import { CompletePackageCommand } from '@application/package/commands/completePackage/CompletePackageCommand';

import { Address } from '@domain/address/entities/Address';
import { Client } from '@domain/client/entities/Client';
import { Package } from '@domain/package/entities/Package';
import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';
import { IPackageRepository, IPackageRepositoryToken } from '@domain/package/repositories/IPackageRepository';
import { IOrderRepository, IOrderRepositoryToken } from '@domain/order/repositories/IOrderRepository';
import { IClientRepository, IClientRepositoryToken } from '@domain/client/repositories/IClientRepository';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';

@injectable()
export class CompletePackageHandler implements IRequestHandler<CompletePackageCommand, Result> {

	constructor(
		@inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository,
        @inject(IPackageRepositoryToken) private readonly packageRepository: IPackageRepository,
		@inject(IClientRepositoryToken) private readonly clientRepository: IClientRepository,
		@inject(IOrderRepositoryToken) private readonly orderRepository: IOrderRepository,
        @inject(IOutboxServiceToken) private readonly outboxService: IOutboxService<DomainEvent>
	) {
	}

	async addOutboxMessage(client: Client, address: Address, packageDomain: Package ): Promise<void> {

		const items = packageDomain.getListPackageItems().map(item => ({
			recipeId: item.getRecipeId(),
			quantity: item.getQuantity()
		}));

		const packageCompletedOutboxMessage = new PackageCompletedOutboxMessage(
			client.getId(),
			packageDomain.getDatePackage(),
			address.getStreet() + ' ' + address.getReference(),
			{
				latitude: address.getLocation().getLatitude().toString(),
				longitude: address.getLocation().getLongitude().toString()
			},
			new Date(),
			items
		);
		const outboxMessage = new OutboxMessage<DomainEvent>(
			packageCompletedOutboxMessage
		);
		await this.outboxService.create(outboxMessage);
	}

	@Transactional()
	async handle(command: CompletePackageCommand): Promise<Result> {
		const { packageId } = command;

		const packageDomain = await this.packageRepository.getById(packageId);

		if (!packageDomain) {
			return Result.failure(
				Exception.NotFound('Package.NotFound', `Package with id ${packageId} not found`)
			);
		}

		const orderId = packageDomain.getOrderId();
		const orderDomain = await this.orderRepository.getById(orderId);

		if (!orderDomain) {
			return Result.failure(
				Exception.NotFound('Order.NotFound', `Order with id ${orderId} not found`)
			);
		}

		const client = await this.clientRepository.getById(packageDomain.getClientId());
		const address = await this.addressRepository.getById(packageDomain.getAddressId());

		if (!client) {
			return Result.failure(
				Exception.NotFound('Client.NotFound', `Client with id ${packageDomain.getClientId()} not found`)
			);
		}

		if (!address) {
			return Result.failure(
				Exception.NotFound('Address.NotFound', `Address with id ${packageDomain.getAddressId()} not found`)
			);
		}

		const packagesItems = packageDomain.getListPackageItems();
		packagesItems.forEach(item => {
			orderDomain.changeQuantityDelivered(item.getRecipeId(), item.getQuantity());
		});

		packageDomain.changeToCompleted();

		await this.orderRepository.update(orderDomain);
		await this.packageRepository.update(packageDomain);
		await this.addOutboxMessage(client, address, packageDomain);

		return Result.success();
	}
}
