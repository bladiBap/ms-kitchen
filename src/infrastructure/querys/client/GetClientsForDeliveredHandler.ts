import { DataSource } from 'typeorm';
import { injectable, inject } from 'tsyringe';
import { DateUtils } from '@shared/utils/Date';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { IClientDeliveredDTO } from '@application/client/dto/ClientToDelivered';
import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';
import { ClientDeliveredDTOMapper } from '@application/client/query/getClientsForDelivery/ClientDeliveredDTOMapper';

import { AddressEntity } from '@infrastructure/persistence/entities/Address';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

@injectable()
export class GetClientsForDeliveredHandler implements IRequestHandler<GetClientsForDeliveredQuery, ResultWithValue<IClientDeliveredDTO[]>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(request: GetClientsForDeliveredQuery): Promise<ResultWithValue<IClientDeliveredDTO[]>> {
		const addressTable = this.dataSource.getRepository(AddressEntity);

		const date = DateUtils.formatDate(request.date);
		const clientsToDelivered = await addressTable.find({
			where: { date: date },
			relations: [
				'calendar',
				'calendar.mealPlan',
				'calendar.mealPlan.client',
				'calendar.mealPlan.dayliDiets',
				'calendar.mealPlan.dayliDiets.recipes'
			]
		});
		const listclientsToDeliveredList = ClientDeliveredDTOMapper.toDTO(clientsToDelivered);
		return ResultWithValue.successWith<IClientDeliveredDTO[]>(listclientsToDeliveredList);
	}
}
