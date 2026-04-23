import { DataSource } from 'typeorm';
import { inject, injectable } from 'tsyringe';
import { DateUtils } from '@shared/utils/Date';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { OrderDTO } from '@application/order/dto/OrderDTO';
import { GetOrderByDayQuery } from '@application/order/queries/GetOrderByDayQuery';
import { OrderDTOMapper } from '@application/order/queries/mappers/OrderDTOMapper';

import { OrderEntity } from '@infrastructure/persistence/entities/OrderEntity';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

@injectable()
export class GetOrderByDayHandler implements  IRequestHandler<GetOrderByDayQuery, ResultWithValue<OrderDTO>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(query: GetOrderByDayQuery): Promise< ResultWithValue<OrderDTO>> {

		const orderTable = this.dataSource.getRepository(OrderEntity);
		const date = DateUtils.formatDate(query.date);

		const order = await orderTable.findOne({
			where: { dateOrdered: date },
			relations: [
				'orderItems',
				'orderItems.recipe',
				'orderItems.recipe.ingredients',
				'orderItems.recipe.ingredients.ingredient',
				'orderItems.recipe.ingredients.ingredient.measurementUnit'
			]
		});

		if (!order) {
			return ResultWithValue.fromValue<OrderDTO>({} as OrderDTO);
		}

		return ResultWithValue.fromValue<OrderDTO>(OrderDTOMapper.toDTO(order));
	}
}
