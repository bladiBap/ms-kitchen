import { DataSource } from 'typeorm';
import { injectable, inject } from 'tsyringe';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { IClientDeliveredDTO } from '@application/client/dto/ClientToDelivered';
import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';
import { ClientDeliveredDTOMapper } from '@application/client/query/getClientsForDelivery/ClientDeliveredDTOMapper';

import { AddressEntity } from '@infrastructure/persistence/entities/AddressEntity';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

@injectable()
export class GetClientsForDeliveredHandler implements IRequestHandler<GetClientsForDeliveredQuery, ResultWithValue<IClientDeliveredDTO[]>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(request: GetClientsForDeliveredQuery): Promise<ResultWithValue<IClientDeliveredDTO[]>> {
		const addressTable = this.dataSource.getRepository(AddressEntity);

		const clientsToDelivered = await addressTable.createQueryBuilder('address')
			.leftJoinAndSelect('address.calendar', 'calendar')
			.leftJoinAndSelect('calendar.mealPlan', 'mealPlan')
			.leftJoinAndSelect('mealPlan.client', 'client')
			.leftJoinAndSelect('mealPlan.dayliDiets', 'dayliDiets', 'dayliDiets.date = :targetDate', {
				targetDate: request.date
			})
			.leftJoinAndSelect('dayliDiets.dayliDietRecipes', 'dietRecipes')
			.leftJoinAndSelect('dietRecipes.recipe', 'recipe')
			.where('address.date = :targetDate', { targetDate: request.date })
			.andWhere('address.needsDelivery = :needsDelivery', { needsDelivery: true })
			.getMany();
		const listclientsToDeliveredList = ClientDeliveredDTOMapper.toDTO(clientsToDelivered);
		return ResultWithValue.successWith<IClientDeliveredDTO[]>(listclientsToDeliveredList);
	}
}
