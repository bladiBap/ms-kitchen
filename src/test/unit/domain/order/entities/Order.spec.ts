import { v4 as uuidv4 } from 'uuid';

import { Order } from '@domain/order/entities/Order';
import { OrderItem } from '@domain/order/entities/OrderItem';
import { OrderCompletedEvent } from '@domain/order/events/OrderCompletedEvent';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('Order', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a new order with a generated id and the provided data', () => {
		mockedUuidv4.mockReturnValue('order-id-1');

		const dateOrdered = new Date('2026-04-25T10:00:00.000Z');
		const dateCreatedOn = new Date('2026-04-24T10:00:00.000Z');
		const order = Order.createNew(dateOrdered, dateCreatedOn, StatusOrder.CREATED);

		expect(order.getIdOrder()).toBe('order-id-1');
		expect(order.getDateOrdered()).toBe(dateOrdered);
		expect(order.getDateCreatedOn()).toBe(dateCreatedOn);
		expect(order.getStatus()).toBe(StatusOrder.CREATED);
		expect(order.getListOrderItems()).toHaveLength(0);
	});

	it('changes an order to completed and emits a domain event', () => {
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.CREATED);

		order.changeToCompleted();

		expect(order.isStatusCompleted()).toBe(true);
		expect(order.getDomainEvents()).toHaveLength(1);
		expect(order.getDomainEvents()[0]).toBeInstanceOf(OrderCompletedEvent);
		expect(order.getDomainEvents()[0]).toMatchObject({
			orderId: 'order-1',
			dateOrder: new Date('2026-04-25T10:00:00.000Z'),
		});
	});

	it('throws when trying to complete an order that is already completed', () => {
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.COMPLETED);

		expect(() => order.changeToCompleted()).toThrow(DomainException);
		try {
			order.changeToCompleted();
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				code: 'OrderError.canNotChangeStatus',
				message: 'Cannot change order status from 1 to 1.',
				type: ExceptionType.Problem,
			});
		}
	});

	it('adds items and exposes them through the order list', () => {
		mockedUuidv4.mockReturnValueOnce('item-1');
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.CREATED);

		order.addItem('recipe-1', 3, 0, 0, StatusOrder.CREATED);

		expect(order.getListOrderItems()).toHaveLength(1);
		const firstItem = order.getListOrderItems()[0];
		expect(firstItem).toBeInstanceOf(OrderItem);
		expect(firstItem).toMatchObject({
			id: 'item-1',
			orderId: 'order-1',
			recipeId: 'recipe-1',
			quantityPlanned: 3,
			quantityPrepared: 0,
			quantityDelivered: 0,
			status: StatusOrder.CREATED,
		});
	});

	it('increments delivered quantity for the matching item', () => {
		const item = new OrderItem('item-1', 'order-1', 3, 2, 0, 'recipe-1', StatusOrder.CREATED);
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.CREATED, [item]);

		order.changeQuantityDelivered('recipe-1', 1);

		expect(order.getListOrderItems()[0]?.getQuantityDelivered()).toBe(1);
	});

	it('throws when the item to update does not exist', () => {
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.CREATED);

		expect(() => order.changeQuantityDelivered('missing-recipe', 1)).toThrow(DomainException);
		try {
			order.changeQuantityDelivered('missing-recipe', 1);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				code: 'OrderError.orderItemNotFound',
				message: 'Order item with recipe id missing-recipe not found in the order.',
				type: ExceptionType.NotFound,
			});
		}
	});

	it('detects when all items are completed', () => {
		const completedItem = new OrderItem('item-1', 'order-1', 2, 2, 1, 'recipe-1', StatusOrder.COMPLETED);
		const pendingItem = new OrderItem('item-2', 'order-1', 2, 1, 0, 'recipe-2', StatusOrder.CREATED);
		const order = new Order('order-1', new Date('2026-04-25T10:00:00.000Z'), new Date('2026-04-24T10:00:00.000Z'), StatusOrder.CREATED, [completedItem, pendingItem]);

		expect(order.verifyIfAllItemsCompleted()).toBe(false);
		pendingItem.increaseQuantityPrepared(1);
		expect(order.verifyIfAllItemsCompleted()).toBe(true);
	});
});
