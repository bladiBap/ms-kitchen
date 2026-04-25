import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { Order } from '@domain/order/entities/Order';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { IOrderRepository } from '@domain/order/repositories/IOrderRepository';
import { IRecipeRepository } from '@domain/recipe/repositories/IRecipeRepository';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';
import { IDailyAllocationRepository } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';
import { GenerateOrderHandler } from '@application/order/commands/generateOrder/GenerateOrderHandler';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('GenerateOrderHandler', () => {
	let findByDateMock: jest.Mock;
	let createOrderMock: jest.Mock;
	let getRecipesToPrepareMock: jest.Mock;
	let getRecipesByClientMock: jest.Mock;
	let createDailyAllocationMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let orderRepository: IOrderRepository;
	let recipeRepository: IRecipeRepository;
	let addressRepository: IAddressRepository;
	let dailyAllocationRepository: IDailyAllocationRepository;

	let handler: GenerateOrderHandler;

	beforeEach(() => {
		findByDateMock = jest.fn();
		createOrderMock = jest.fn(async (entity: Order) => entity);
		getRecipesToPrepareMock = jest.fn();
		getRecipesByClientMock = jest.fn();
		createDailyAllocationMock = jest.fn(async (entity) => entity);

		startMock = jest.fn(async () => undefined);
		commitMock = jest.fn(async () => undefined);
		rollbackMock = jest.fn(async () => undefined);

		const uowMock: IUnitOfWork = {
			start: startMock,
			commit: commitMock,
			rollback: rollbackMock,
			getManager: jest.fn() as any,
		};

		container.registerInstance(IUnitOfWorkToken, uowMock);

		orderRepository = {
			findByDate: findByDateMock,
			create: createOrderMock,
		} as unknown as IOrderRepository;

		recipeRepository = {
			getRecipesToPrepare: getRecipesToPrepareMock,
		} as unknown as IRecipeRepository;

		addressRepository = {
			getRecipesByClient: getRecipesByClientMock,
		} as unknown as IAddressRepository;

		dailyAllocationRepository = {
			create: createDailyAllocationMock,
		} as unknown as IDailyAllocationRepository;

		handler = new GenerateOrderHandler(orderRepository, addressRepository, recipeRepository, dailyAllocationRepository);
	});

	it('returns conflict when an order already exists for the date', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		findByDateMock.mockResolvedValue(new Order('order-1', date, date, StatusOrder.CREATED));

		const result = await handler.handle(new GenerateOrderCommand(date));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Order.AlreadyExists',
			type: ExceptionType.Conflict,
		});
		expect(getRecipesToPrepareMock).not.toHaveBeenCalled();
		expect(getRecipesByClientMock).not.toHaveBeenCalled();
		expect(createOrderMock).not.toHaveBeenCalled();
		expect(createDailyAllocationMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns not found when there are no recipes to prepare', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		findByDateMock.mockResolvedValue(null);
		getRecipesToPrepareMock.mockResolvedValue([]);
		getRecipesByClientMock.mockResolvedValue([]);

		const result = await handler.handle(new GenerateOrderCommand(date));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Order.NoRecipes',
			type: ExceptionType.NotFound,
		});
		expect(createOrderMock).not.toHaveBeenCalled();
		expect(createDailyAllocationMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('creates order and daily allocation when data is valid', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		findByDateMock.mockResolvedValue(null);
		getRecipesToPrepareMock.mockResolvedValue([
			{ recipeId: 'recipe-1', quantity: 3 },
			{ recipeId: 'recipe-2', quantity: 1 },
		]);
		getRecipesByClientMock.mockResolvedValue([
			{ clientId: 'client-1', recipeId: 'recipe-1', quantity: 2 },
			{ clientId: 'client-1', recipeId: 'recipe-2', quantity: 1 },
		]);

		const result = await handler.handle(new GenerateOrderCommand(date));

		expect(result.isSuccess).toBe(true);
		expect(createOrderMock).toHaveBeenCalledTimes(1);
		expect(createDailyAllocationMock).toHaveBeenCalledTimes(1);

		const createdOrder = createOrderMock.mock.calls[0][0] as Order;
		expect(createdOrder.getDateOrdered()).toEqual(date);
		expect(createdOrder.getStatus()).toBe(StatusOrder.CREATED);
		expect(createdOrder.getListOrderItems()).toHaveLength(2);
		expect(createdOrder.getListOrderItems().map(item => item.getRecipeId())).toEqual(['recipe-1', 'recipe-2']);

		const createdAllocation = createDailyAllocationMock.mock.calls[0][0];
		expect(createdAllocation.getDate()).toEqual(date);
		expect(createdAllocation.getLines()).toHaveLength(2);
		expect(createdAllocation.getLines().map((line: any) => line.getClientId())).toEqual(['client-1', 'client-1']);
		expect(createdAllocation.getLines().map((line: any) => line.getRecipeId())).toEqual(['recipe-1', 'recipe-2']);

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});

	it('rolls back and returns unexpected error when a repository throws', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		findByDateMock.mockResolvedValue(null);
		getRecipesToPrepareMock.mockRejectedValue(new Error('db down'));

		const result = await handler.handle(new GenerateOrderCommand(date));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'UnexpectedError',
			type: ExceptionType.UnexpectedError,
		});

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});
});
