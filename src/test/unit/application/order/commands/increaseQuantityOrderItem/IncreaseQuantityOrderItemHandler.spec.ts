import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { Order } from '@domain/order/entities/Order';
import { OrderItem } from '@domain/order/entities/OrderItem';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { IOrderRepository } from '@domain/order/repositories/IOrderRepository';
import { IOrderItemRepository } from '@domain/order/repositories/IOrderItemRepository';

import { IncreaseQuantityOrderItemCommand } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { IncreaseQuantityOrderItemHandler } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemHandler';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('IncreaseQuantityOrderItemHandler', () => {
	let getByIdOrderItemMock: jest.Mock;
	let updateOrderItemMock: jest.Mock;
	let getByIdTodayMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let orderRepository: IOrderRepository;
	let orderItemRepository: IOrderItemRepository;

	let handler: IncreaseQuantityOrderItemHandler;

	beforeEach(() => {
		getByIdOrderItemMock = jest.fn();
		updateOrderItemMock = jest.fn(async (entity: OrderItem) => entity);
		getByIdTodayMock = jest.fn();

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
			getByIdToday: getByIdTodayMock,
		} as unknown as IOrderRepository;

		orderItemRepository = {
			getById: getByIdOrderItemMock,
			update: updateOrderItemMock,
		} as unknown as IOrderItemRepository;

		handler = new IncreaseQuantityOrderItemHandler(orderRepository, orderItemRepository);
	});

	it('returns not found when order item does not exist', async () => {
		getByIdOrderItemMock.mockResolvedValue(null);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('missing-item', 1));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'OrderItem.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(getByIdTodayMock).not.toHaveBeenCalled();
		expect(updateOrderItemMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns invalid operation when order item is already completed', async () => {
		const orderItem = new OrderItem('item-1', 'order-1', 3, 3, 0, 'recipe-1', StatusOrder.COMPLETED);
		getByIdOrderItemMock.mockResolvedValue(orderItem);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1', 1));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'OrderItem.AlreadyCompleted',
			type: ExceptionType.InvalidOperation,
		});
		expect(getByIdTodayMock).not.toHaveBeenCalled();
		expect(updateOrderItemMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns not found when order for today does not exist', async () => {
		const orderItem = new OrderItem('item-1', 'order-1', 3, 0, 0, 'recipe-1', StatusOrder.CREATED);
		getByIdOrderItemMock.mockResolvedValue(orderItem);
		getByIdTodayMock.mockResolvedValue(null);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1', 1));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Order.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(updateOrderItemMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns invalid operation when order is already completed', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const orderItem = new OrderItem('item-1', 'order-1', 3, 0, 0, 'recipe-1', StatusOrder.CREATED);
		const completedOrder = new Order('order-1', date, date, StatusOrder.COMPLETED);

		getByIdOrderItemMock.mockResolvedValue(orderItem);
		getByIdTodayMock.mockResolvedValue(completedOrder);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1', 1));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'OrderItem.CompleteFailed',
			type: ExceptionType.InvalidOperation,
		});
		expect(updateOrderItemMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('updates quantity and commits when request is valid', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const orderItem = new OrderItem('item-1', 'order-1', 5, 1, 0, 'recipe-1', StatusOrder.CREATED);
		const order = new Order('order-1', date, date, StatusOrder.CREATED);

		getByIdOrderItemMock.mockResolvedValue(orderItem);
		getByIdTodayMock.mockResolvedValue(order);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1', 2));

		expect(result.isSuccess).toBe(true);
		expect(orderItem.getQuantityPrepared()).toBe(3);
		expect(updateOrderItemMock).toHaveBeenCalledTimes(1);
		expect(updateOrderItemMock).toHaveBeenCalledWith(orderItem);

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});

	it('uses planned quantity when command quantity is undefined', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const orderItem = new OrderItem('item-1', 'order-1', 4, 0, 0, 'recipe-1', StatusOrder.CREATED);
		const order = new Order('order-1', date, date, StatusOrder.CREATED);

		getByIdOrderItemMock.mockResolvedValue(orderItem);
		getByIdTodayMock.mockResolvedValue(order);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1'));

		expect(result.isSuccess).toBe(true);
		expect(orderItem.getQuantityPrepared()).toBe(4);
		expect(orderItem.isStatusCompleted()).toBe(true);
		expect(updateOrderItemMock).toHaveBeenCalledTimes(1);

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});

	it('rolls back and returns domain validation error when quantity exceeds planned', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const orderItem = new OrderItem('item-1', 'order-1', 3, 1, 0, 'recipe-1', StatusOrder.CREATED);
		const order = new Order('order-1', date, date, StatusOrder.CREATED);

		getByIdOrderItemMock.mockResolvedValue(orderItem);
		getByIdTodayMock.mockResolvedValue(order);

		const result = await handler.handle(new IncreaseQuantityOrderItemCommand('item-1', 5));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'ValidationError',
			type: ExceptionType.ValidationError,
		});
		expect(updateOrderItemMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});
});
