import { randomUUID } from 'crypto';
import { injectable, inject } from 'tsyringe';
import { CommandHandler } from '@/Common/Mediator/Decorators';
import { CreatePackageCommand } from './CreatePackageCommand';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { Package } from '@domain/Package/Entities/Package';
import { PackageItem } from '@domain/Package/Entities/PackageItem';
import { StatusPackage } from '@domain/Package/Types/StatusPackage';
import { Result } from '@common/Core/Results/Result';
import { Exception } from '@common/Core/Results/Exception';
import { IPackageRepository } from '@domain/Package/Repositories/IPackageRepository';
import { IClientRepository } from '@domain/Client/Repositories/IClientRepository';
import { IAddressRepository } from '@domain/Address/Repositories/IAddressRepository';
import { IDailyAllocationRepository } from '@domain/DailyAllocation/Repositories/IDailyAllocationRepository';
import { CodeGenerator } from '@/Common/Utils/Code';
import { PackageCompleted } from '@domain/Package/Events/PackageCompleted';
import { DomainEvent } from '@common/Core/Abstractions/DomainEvent';
import { OutboxMessage } from '@outbox/Model/OutboxMessage';
import { IOutboxService } from '@outbox/Service/Interface/IOutboxService';
import { Client } from '@domain/Client/Entities/Client';
import { Address } from '@domain/Address/Entities/Address';

@injectable()
@CommandHandler(CreatePackageCommand)
export class CreatePackageHandler {

	constructor(
        @inject('IUnitOfWork') private readonly unitOfWork: IUnitOfWork,
        @inject('IClientRepository') private readonly clientRepository: IClientRepository,
        @inject('IAddressRepository') private readonly addressRepository: IAddressRepository,
        @inject('IPackageRepository') private readonly packageRepository: IPackageRepository,
        @inject('IDailyAllocationRepository') private readonly dailyAllocationRepository: IDailyAllocationRepository,
        @inject('IOutboxService') private readonly _outboxService: IOutboxService<DomainEvent>
	) {
	}

	async addOutboxMessage(client: Client, address: Address ): Promise<void> {
		const packageCompletedEvent = new PackageCompleted(
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
		await this._outboxService.addAsync(outboxMessage);
	}

	async execute(command: CreatePackageCommand): Promise<Result> {
		const { clientId, recipeIds, date } = command;

		await this.unitOfWork.startTransaction();

		try {

			const client =  await this.clientRepository.getByIdAsync(clientId);
			if (!client) {
				await this.unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('Client.NotFound', `Client with id ${clientId} not found`)
				);
			}

			const address = await this.addressRepository.getAddressByDateAndClientId(clientId, date);
			if (!address) {
				await this.unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('Address.NotFound', `No address found for client id ${clientId} today`)
				);
			}

			const packageExists = await this.packageRepository.getPackageByAddressClientIdAsync(address.getId(), clientId);
			if (packageExists) {
				await this.unitOfWork.rollback();
				return Result.failure(
					Exception.Conflict('Package.AlreadyExists', `Package already exists for client id ${clientId} at address id ${address.getId()} today`)
				);
			}

			const dailyAllocation = await this.dailyAllocationRepository.getDailyAllocation(clientId, date);
			if (!dailyAllocation) {
				await this.unitOfWork.rollback();
				return Result.failure(
					Exception.NotFound('DailyAllocation.NotFound', `No daily allocation found for client id ${clientId} today`)
				);
			}

			const clientHasAllRecipes = dailyAllocation.clientHasAllRecipes(clientId, recipeIds);
			if (!clientHasAllRecipes) {
				await this.unitOfWork.rollback();
				return Result.failure(
					Exception.InvalidOperation('DailyAllocation.MissingRecipes', `Client with id ${clientId} does not have all recipes for today`)
				);
			}

			const newPackage = new Package(0, CodeGenerator.generateCode(), StatusPackage.PACKAGING, clientId, address.getId(), new Date());
			for (const line of dailyAllocation.getLines()) {
				newPackage.addPackageItem(new PackageItem(0, line.getRecipeId(), newPackage.getId(), line.getQuantityNeeded()));
				line.updateQuantityPackaged(line.getQuantityNeeded());
			}
            
			await this.packageRepository.addAsync(newPackage);
			await this.dailyAllocationRepository.updatedLines(dailyAllocation.getLines());
			await this.addOutboxMessage(client, address);
			await this.unitOfWork.commit();

			return Result.success();
		} catch (error)   {
			await this.unitOfWork.rollback();
			return Result.failure(
				Exception.Problem(
					'Package.CreationFailed',
					'Error creating package: ' + (error as Error).message
				)
			);
		}
	}
}