import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { Order } from '@domain/order/entities/Order';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';

import { IOrderRepository, IOrderRepositoryToken } from '@domain/order/repositories/IOrderRepository';
import { IRecipeRepository, IRecipeRepositoryToken } from '@domain/recipe/repositories/IRecipeRepository';
import { IAddressRepository, IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';
import { IDailyAllocationRepository, IDailyAllocationRepositoryToken } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

import { Transactional } from '@application/common/decorator/Transactional';
import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';

@injectable()
export class GenerateOrderHandler implements IRequestHandler<GenerateOrderCommand, Result> {
	constructor(
        @inject(IOrderRepositoryToken) private readonly orderRepository: IOrderRepository,
        @inject(IAddressRepositoryToken) private readonly addressRepository: IAddressRepository,
        @inject(IRecipeRepositoryToken) private readonly recipeRepository: IRecipeRepository,
        @inject(IDailyAllocationRepositoryToken) private readonly dailyAllocationRepository: IDailyAllocationRepository,
	) {}

	@Transactional()
	async handle( generateOrderCommand: GenerateOrderCommand): Promise<Result> {

		const date = generateOrderCommand.date;
		const order = await this.orderRepository.findByDate(date);
		if (order) {
			return Result.failure(Exception.Conflict('Order.AlreadyExists', 'An order already exists for the given date'));
		}

		const newOrder = Order.createNew(date, date, StatusOrder.CREATED);
		const dailyAllocations = DailyAllocation.createNew(date);

		const recipesToPrepare = await this.recipeRepository.getRecipesToPrepare(date);
		const recipesByClient = await this.addressRepository.getRecipesByClient(date);

		if (recipesToPrepare.length === 0) {
			return Result.failure(
				Exception.NotFound('Order.NoRecipes', 'No recipes found to generate an order')
			);
		}

		for (const recipeToPrepare of recipesToPrepare) {
			newOrder.addItem(recipeToPrepare.recipeId, recipeToPrepare.quantity, 0, 0, StatusOrder.CREATED);
		}

		for (const recipeByClient of recipesByClient) {
			const line = AllocationLine.createNew(dailyAllocations.getId(), recipeByClient.clientId, recipeByClient.recipeId, recipeByClient.quantity);
			dailyAllocations.addLine(line);
		}

		await this.orderRepository.create(newOrder);
		await this.dailyAllocationRepository.create(dailyAllocations);

		return Result.success();
	}
}
