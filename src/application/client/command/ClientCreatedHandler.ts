import { inject, injectable } from 'tsyringe';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Transactional } from '@application/common/decorator/Transactional';
import { ClientCreatedCommand } from '@application/client/command/ClientCreatedCommand';

import { Client } from '@domain/client/entities/Client';
import { IClientRepository, IClientRepositoryToken } from '@domain/client/repositories/IClientRepository';
import { Result } from '@core/results/Result';
import { ClientError } from '@domain/client/errors/ClientError';

@injectable()
export class ClientCreatedHandler implements IRequestHandler <ClientCreatedCommand, Result> {

	constructor(
        @inject(IClientRepositoryToken) private readonly clientRepository: IClientRepository,
	) {}

	@Transactional()
	async handle(clientCreatedCommand: ClientCreatedCommand): Promise<Result> {

		const cliente: Client = new Client(clientCreatedCommand.id, clientCreatedCommand.name);
		const existingClient = await this.clientRepository.getById(cliente.getId());
		if (existingClient) {
			return Result.failure(ClientError.alreadyExists());
		}
		await this.clientRepository.create(cliente);
		return Result.success();
	}
}
