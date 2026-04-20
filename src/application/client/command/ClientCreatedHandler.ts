import { inject, injectable } from 'tsyringe';
import { ClientCreatedCommand } from './ClientCreatedCommand';
import { CommandHandler } from '@common/Mediator/Decorators';
import { IUnitOfWork } from '@common/Core/Abstractions/IUnitOfWork';
import { IClientRepository } from '@domain/Client/Repositories/IClientRepository';
import { Client } from '@domain/Client/Entities/Client';

@injectable()
@CommandHandler(ClientCreatedCommand)
export class ClientCreatedHandler {
	constructor(
        @inject('IUnitOfWork') private readonly _unitOfWork: IUnitOfWork,
        @inject('IClientRepository') private readonly _clientRepository: IClientRepository,
	) {}

	async execute( clientCreatedCommand: ClientCreatedCommand): Promise<void> {
		try {
			await this._unitOfWork.startTransaction();
			const cliente: Client = new Client(clientCreatedCommand.id, clientCreatedCommand.name);
			const existingClient = await this._clientRepository.getByIdAsync(cliente.getId());
			if (existingClient) {
				throw new Error('Client already exists with the same ID ' + cliente.getId());
			}
			await this._clientRepository.addAsync(cliente);
			await this._unitOfWork.commit();
		} catch (error) {
			await this._unitOfWork.rollback();
			console.error('Error creating client:', error);
		}
	}
}
