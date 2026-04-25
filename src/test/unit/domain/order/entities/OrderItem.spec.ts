import { v4 as uuidv4 } from 'uuid';

import { OrderItem } from '@domain/order/entities/OrderItem';
import { OrderItemCompletedEvent } from '@domain/order/events/OrderItemCompletedEvent';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('OrderItem', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a new order item with default counters and created status', () => {
		mockedUuidv4.mockReturnValue('item-id-1');

		const item = OrderItem.create('order-1', 3, 'recipe-1');

		expect(item.getOrderId()).toBe('order-1');
		expect(item.getRecipeId()).toBe('recipe-1');
		expect(item.getQuantityPlanned()).toBe(3);
		expect(item.getQuantityPrepared()).toBe(0);
		expect(item.getQuantityDelivered()).toBe(0);
		expect(item.getStatus()).toBe(StatusOrder.CREATED);
		expect(item.getDomainEvents()).toHaveLength(0);
	});

	it('throws when quantity planned is not greater than zero', () => {
		expect(() => new OrderItem('item-1', 'order-1', 0, 0, 0, 'recipe-1', StatusOrder.CREATED)).toThrow(DomainException);
		try {
			new OrderItem('item-1', 'order-1', 0, 0, 0, 'recipe-1', StatusOrder.CREATED);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Quantity must be greater than zero. Given: 0.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('increments prepared quantity and completes the item when it reaches the planned amount', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 1, 0, 'recipe-1', StatusOrder.CREATED);

		item.increaseQuantityPrepared(2);

		expect(item.getQuantityPrepared()).toBe(3);
		expect(item.isStatusCompleted()).toBe(true);
		expect(item.getDomainEvents()).toHaveLength(1);
		expect(item.getDomainEvents()[0]).toBeInstanceOf(OrderItemCompletedEvent);
		expect(item.getDomainEvents()[0]).toMatchObject({
			orderId: 'order-1',
		});
	});

	it('does not change prepared quantity when the item is already fully prepared', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 3, 0, 'recipe-1', StatusOrder.COMPLETED);

		item.increaseQuantityPrepared(1);

		expect(item.getQuantityPrepared()).toBe(3);
		expect(item.getDomainEvents()).toHaveLength(0);
	});

	it('throws when prepared quantity exceeds the planned amount', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 1, 0, 'recipe-1', StatusOrder.CREATED);

		expect(() => item.increaseQuantityPrepared(3)).toThrow(DomainException);
		try {
			item.increaseQuantityPrepared(3);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'The prepared quantity (4) exceeds the planned quantity (3).',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('increments delivered quantity only up to the prepared amount', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 2, 0, 'recipe-1', StatusOrder.CREATED);

		item.increaseQuantityDelivered(2);

		expect(item.getQuantityDelivered()).toBe(2);
		expect(item.remainingQuantityToDeliver()).toBe(0);
	});

	it('throws when delivered quantity exceeds prepared quantity', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 2, 0, 'recipe-1', StatusOrder.CREATED);

		expect(() => item.increaseQuantityDelivered(3)).toThrow(DomainException);
		try {
			item.increaseQuantityDelivered(3);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'The delivered quantity (3) exceeds the prepared quantity (2).',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws when prepared quantity increment is not positive', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 0, 0, 'recipe-1', StatusOrder.CREATED);

		expect(() => item.increaseQuantityPrepared(0)).toThrow(DomainException);
		try {
			item.increaseQuantityPrepared(0);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Quantity must be greater than zero. Given: 0.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws when delivered quantity increment is not positive', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 2, 0, 'recipe-1', StatusOrder.CREATED);

		expect(() => item.increaseQuantityDelivered(0)).toThrow(DomainException);
		try {
			item.increaseQuantityDelivered(0);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Quantity must be greater than zero. Given: 0.',
				type: ExceptionType.ValidationError,
			});
		}
	});
});
