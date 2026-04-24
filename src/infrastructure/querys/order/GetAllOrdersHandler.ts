import { DataSource } from 'typeorm';
import { inject, injectable } from 'tsyringe';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { OrderDTO } from '@application/order/dto/OrderDTO';
import { OrderDTOMapper } from '@application/order/queries/mappers/OrderDTOMapper';
import { GetAllOrdersQuery } from '@application/order/queries/GetAllOrdersQuery';

import { OrderEntity } from '@infrastructure/persistence/entities/OrderEntity';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

@injectable()
export class GetAllOrdersHandler implements IRequestHandler<GetAllOrdersQuery, ResultWithValue<OrderDTO[]>> {

	constructor(
		@inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(_: GetAllOrdersQuery): Promise<ResultWithValue<OrderDTO[]>> {
		const orderTable = this.dataSource.getRepository(OrderEntity);

		const orders = await orderTable.find({
			relations: [
				'orderItems',
				'orderItems.recipe',
				'orderItems.recipe.ingredients',
				'orderItems.recipe.ingredients.ingredient',
				'orderItems.recipe.ingredients.ingredient.measurementUnit'
			],
			order: {
				dateOrdered: 'DESC',
				dateCreatedOn: 'DESC'
			}
		});

		const ordersDTO = orders.map((order) => OrderDTOMapper.toDTO(order));
		return ResultWithValue.fromValue<OrderDTO[]>(ordersDTO);
	}
}
