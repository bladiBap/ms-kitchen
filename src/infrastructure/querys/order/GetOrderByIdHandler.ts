import { DataSource } from 'typeorm';
import { inject, injectable } from 'tsyringe';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { OrderDTO } from '@application/order/dto/OrderDTO';
import { OrderDTOMapper } from '@application/order/queries/mappers/OrderDTOMapper';
import { GetOrderByIdQuery } from '@application/order/queries/GetOrderByIdQuery';

import { OrderEntity } from '@infrastructure/persistence/entities/OrderEntity';
import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

@injectable()
export class GetOrderByIdHandler implements IRequestHandler<GetOrderByIdQuery, ResultWithValue<OrderDTO>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(query: GetOrderByIdQuery): Promise< ResultWithValue<OrderDTO>> {

		const orderTable = this.dataSource.getRepository(OrderEntity);
		const orderId = query.id;

		const order = await orderTable.findOne({
			where: { id: orderId },
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
