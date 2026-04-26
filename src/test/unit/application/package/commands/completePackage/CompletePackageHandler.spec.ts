import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { CompletePackageCommand } from '@application/package/commands/completePackage/CompletePackageCommand';
import { CompletePackageHandler } from '@application/package/commands/completePackage/CompletePackageHandler';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';
import { Client } from '@domain/client/entities/Client';
import { IClientRepository } from '@domain/client/repositories/IClientRepository';
import { Order } from '@domain/order/entities/Order';
import { OrderItem } from '@domain/order/entities/OrderItem';
import { IOrderRepository } from '@domain/order/repositories/IOrderRepository';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';
import { Package } from '@domain/package/entities/Package';
import { PackageItem } from '@domain/package/entities/PackageItem';
import { IPackageRepository } from '@domain/package/repositories/IPackageRepository';
import { StatusPackage } from '@domain/package/types/StatusPackage';

import { IOutboxService } from '@outbox/service/interface/IOutboxService';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('CompletePackageHandler', () => {
	let getPackageByIdMock: jest.Mock;
	let updatePackageMock: jest.Mock;
	let getOrderByIdMock: jest.Mock;
	let updateOrderMock: jest.Mock;
	let getClientByIdMock: jest.Mock;
	let getAddressByIdMock: jest.Mock;
	let outboxCreateMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let packageRepository: IPackageRepository;
	let orderRepository: IOrderRepository;
	let clientRepository: IClientRepository;
	let addressRepository: IAddressRepository;
	let outboxService: IOutboxService<unknown>;

	let handler: CompletePackageHandler;

	beforeEach(() => {
		getPackageByIdMock = jest.fn();
		updatePackageMock = jest.fn(async (entity) => entity);
		getOrderByIdMock = jest.fn();
		updateOrderMock = jest.fn(async (entity) => entity);
		getClientByIdMock = jest.fn();
		getAddressByIdMock = jest.fn();
		outboxCreateMock = jest.fn(async () => undefined);

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

		packageRepository = {
			getById: getPackageByIdMock,
			update: updatePackageMock,
		} as unknown as IPackageRepository;

		orderRepository = {
			getById: getOrderByIdMock,
			update: updateOrderMock,
		} as unknown as IOrderRepository;

		clientRepository = {
			getById: getClientByIdMock,
		} as unknown as IClientRepository;

		addressRepository = {
			getById: getAddressByIdMock,
		} as unknown as IAddressRepository;

		outboxService = {
			create: outboxCreateMock,
		} as unknown as IOutboxService<unknown>;

		handler = new CompletePackageHandler(
			addressRepository,
			packageRepository,
			clientRepository,
			orderRepository,
			outboxService
		);
	});

	it('returns not found when package does not exist', async () => {
		getPackageByIdMock.mockResolvedValue(null);

		const result = await handler.handle(new CompletePackageCommand('missing-package'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Package.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(updateOrderMock).not.toHaveBeenCalled();
		expect(updatePackageMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns conflict when package is already completed', async () => {
		const packageDomain = new Package(
			'package-1',
			'order-1',
			'PKG001',
			StatusPackage.COMPLETED,
			'client-1',
			'address-1',
			new Date('2026-04-25T00:00:00.000Z'),
			[]
		);

		getPackageByIdMock.mockResolvedValue(packageDomain);

		const result = await handler.handle(new CompletePackageCommand('package-1'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Package.AlreadyCompleted',
			type: ExceptionType.Conflict,
		});
		expect(getOrderByIdMock).not.toHaveBeenCalled();
		expect(updateOrderMock).not.toHaveBeenCalled();
		expect(updatePackageMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns not found when order does not exist', async () => {
		const packageDomain = new Package(
			'package-1',
			'order-1',
			'PKG001',
			StatusPackage.CREATED,
			'client-1',
			'address-1',
			new Date('2026-04-25T00:00:00.000Z'),
			[]
		);

		getPackageByIdMock.mockResolvedValue(packageDomain);
		getOrderByIdMock.mockResolvedValue(null);

		const result = await handler.handle(new CompletePackageCommand('package-1'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Order.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(updateOrderMock).not.toHaveBeenCalled();
		expect(updatePackageMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('updates order and package and creates outbox message when request is valid', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const packageDomain = new Package(
			'package-1',
			'order-1',
			'PKG001',
			StatusPackage.CREATED,
			'client-1',
			'address-1',
			date,
			[
				new PackageItem('item-1', 'recipe-1', 'package-1', 2),
			]
		);

		const order = new Order('order-1', date, date, StatusOrder.CREATED, [
			new OrderItem('order-item-1', 'order-1', 3, 3, 0, 'recipe-1', StatusOrder.CREATED),
		]);
		const client = new Client('client-1', 'Alice');
		const address = new Address('address-1', 'calendar-1', date, 'Main St', 'Apt 12', new Coordinates(-17.79, -63.18), true);

		getPackageByIdMock.mockResolvedValue(packageDomain);
		getOrderByIdMock.mockResolvedValue(order);
		getClientByIdMock.mockResolvedValue(client);
		getAddressByIdMock.mockResolvedValue(address);

		const result = await handler.handle(new CompletePackageCommand('package-1'));

		expect(result.isSuccess).toBe(true);
		expect(order.getListOrderItems()[0]?.getQuantityDelivered()).toBe(2);
		expect(packageDomain.isCompleted()).toBe(true);

		expect(updateOrderMock).toHaveBeenCalledTimes(1);
		expect(updateOrderMock).toHaveBeenCalledWith(order);
		expect(updatePackageMock).toHaveBeenCalledTimes(1);
		expect(updatePackageMock).toHaveBeenCalledWith(packageDomain);
		expect(outboxCreateMock).toHaveBeenCalledTimes(1);

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});
});
