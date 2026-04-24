import { randomUUID } from 'crypto';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { CodeGenerator } from '@shared/utils/Code';

import { Exception } from '@core/results/Exception';
import { DomainEvent } from '@core/abstraction/DomainEvent';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { OutboxMessage } from '@outbox/model/OutboxMessage';
import { IOutboxService, IOutboxServiceToken } from '@outbox/service/interface/IOutboxService';

import { Transactional } from '@application/common/decorator/Transactional';
import { CreatePackageCommand } from '@application/package/commands/createPackage/CreatePackageCommand';

import { Package } from '@domain/package/entities/Package';
import { PackageItem } from '@domain/package/entities/PackageItem';
import { Address } from '@domain/address/entities/Address';
import { Client } from '@domain/client/entities/Client';
import { StatusPackage } from '@domain/package/types/StatusPackage';
import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';
import { IPackageRepository, IPackageRepositoryToken } from '@domain/package/repositories/IPackageRepository';
import { IClientRepository, IClientRepositoryToken } from '@domain/client/repositories/IClientRepository';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';
import { IDailyAllocationRepository, IDailyAllocationRepositoryToken } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

@injectable()
export class CreatePackageHandler implements IRequestHandler<CreatePackageCommand, Result> {

	constructor(
        @inject(IClientRepositoryToken) private readonly clientRepository: IClientRepository,
        @inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository,
        @inject(IPackageRepositoryToken) private readonly packageRepository: IPackageRepository,
        @inject(IDailyAllocationRepositoryToken) private readonly dailyAllocationRepository: IDailyAllocationRepository,
        @inject(IOutboxServiceToken) private readonly _outboxService: IOutboxService<DomainEvent>
	) {
	}

	async addOutboxMessage(client: Client, address: Address ): Promise<void> {
		const packageCompletedEvent = new PackageCompletedOutboxMessage(
			randomUUID(),
			new Date(),
			address.getStreet() + ' ' + address.getReference(),
			{
				latitude: address.getLocation().getLatitude().toString(),
				longitude: address.getLocation().getLongitude().toString()
			},
			new Date(),
			[
				{
					recipeId: randomUUID(),
					quantity: 1
				},
				{
					recipeId: randomUUID(),
					quantity: 2
				}
			]
		);
		const outboxMessage : OutboxMessage<DomainEvent> = new OutboxMessage<DomainEvent>(
			packageCompletedEvent
		);
		await this._outboxService.create(outboxMessage);
	}

	@Transactional()
	async handle(command: CreatePackageCommand): Promise<Result> {
		const { orderId, clientId, recipeIds, date } = command;

		const client =  await this.clientRepository.getById(clientId);
		if (!client) {
			return Result.failure(
				Exception.NotFound('Client.NotFound', `Client with id ${clientId} not found`)
			);
		}

		const address = await this.addressRepository.getAddressByDateAndClientId(clientId, date);
		if (!address) {
			return Result.failure(
				Exception.NotFound('Address.NotFound', `No address found for client id ${clientId} today`)
			);
		}

		const packageExists = await this.packageRepository.getPackageByAddressClientId(address.getId(), clientId);
		if (packageExists) {
			return Result.failure(
				Exception.Conflict('Package.AlreadyExists', `Package already exists for client id ${clientId} at address id ${address.getId()} today`)
			);
		}

		const dailyAllocation = await this.dailyAllocationRepository.getDailyAllocation(clientId, date);
		if (!dailyAllocation) {
			return Result.failure(
				Exception.NotFound('DailyAllocation.NotFound', `No daily allocation found for client id ${clientId} today`)
			);
		}

		const clientHasAllRecipes = dailyAllocation.clientHasAllRecipes(clientId, recipeIds);
		if (!clientHasAllRecipes) {
			return Result.failure(
				Exception.InvalidOperation('DailyAllocation.MissingRecipes', `Client with id ${clientId} does not have all recipes for today`)
			);
		}

		const newPackage = Package.createNew(orderId, CodeGenerator.generateCode(), StatusPackage.CREATED, clientId, address.getId(), new Date());
		for (const line of dailyAllocation.getLines()) {
			newPackage.addPackageItem(PackageItem.createNew(line.getRecipeId(), newPackage.getId(), line.getQuantityNeeded()));
			line.updateQuantityPackaged(line.getQuantityNeeded());
		}

		await this.packageRepository.create(newPackage);
		await this.dailyAllocationRepository.updatedLines(dailyAllocation.getLines());
		await this.addOutboxMessage(client, address);

		return Result.success();

	}
}
