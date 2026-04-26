import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { CreatePackageCommand } from '@application/package/commands/createPackage/CreatePackageCommand';
import { CreatePackageHandler } from '@application/package/commands/createPackage/CreatePackageHandler';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';
import { Client } from '@domain/client/entities/Client';
import { IClientRepository } from '@domain/client/repositories/IClientRepository';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { IDailyAllocationRepository } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';
import { IPackageRepository } from '@domain/package/repositories/IPackageRepository';

import { IOutboxService } from '@outbox/service/interface/IOutboxService';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('CreatePackageHandler', () => {
	let getClientByIdMock: jest.Mock;
	let getAddressByDateAndClientIdMock: jest.Mock;
	let getPackageByAddressClientIdMock: jest.Mock;
	let getDailyAllocationMock: jest.Mock;
	let createPackageMock: jest.Mock;
	let updatedLinesMock: jest.Mock;
	let outboxCreateMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let clientRepository: IClientRepository;
	let addressRepository: IAddressRepository;
	let packageRepository: IPackageRepository;
	let dailyAllocationRepository: IDailyAllocationRepository;
	let outboxService: IOutboxService<unknown>;

	let handler: CreatePackageHandler;

	beforeEach(() => {
		getClientByIdMock = jest.fn();
		getAddressByDateAndClientIdMock = jest.fn();
		getPackageByAddressClientIdMock = jest.fn();
		getDailyAllocationMock = jest.fn();
		createPackageMock = jest.fn(async (entity) => entity);
		updatedLinesMock = jest.fn(async () => undefined);
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

		clientRepository = {
			getById: getClientByIdMock,
		} as unknown as IClientRepository;

		addressRepository = {
			getAddressByDateAndClientId: getAddressByDateAndClientIdMock,
		} as unknown as IAddressRepository;

		packageRepository = {
			getPackageByAddressClientId: getPackageByAddressClientIdMock,
			create: createPackageMock,
		} as unknown as IPackageRepository;

		dailyAllocationRepository = {
			getDailyAllocation: getDailyAllocationMock,
			updatedLines: updatedLinesMock,
		} as unknown as IDailyAllocationRepository;

		outboxService = {
			create: outboxCreateMock,
		} as unknown as IOutboxService<unknown>;

		handler = new CreatePackageHandler(
			clientRepository,
			addressRepository,
			packageRepository,
			dailyAllocationRepository,
			outboxService
		);
	});

	it('returns not found when client does not exist', async () => {
		getClientByIdMock.mockResolvedValue(null);

		const result = await handler.handle(
			new CreatePackageCommand('order-1', 'client-missing', new Date('2026-04-25T00:00:00.000Z'), ['recipe-1'])
		);

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Client.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(createPackageMock).not.toHaveBeenCalled();
		expect(updatedLinesMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns conflict when package already exists for client and address', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const client = new Client('client-1', 'Alice');
		const address = new Address('address-1', 'calendar-1', date, 'Main St', 'Apt 12', new Coordinates(-17.79, -63.18), true);

		getClientByIdMock.mockResolvedValue(client);
		getAddressByDateAndClientIdMock.mockResolvedValue(address);
		getPackageByAddressClientIdMock.mockResolvedValue({ id: 'pkg-existing' });

		const result = await handler.handle(new CreatePackageCommand('order-1', 'client-1', date, ['recipe-1']));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Package.AlreadyExists',
			type: ExceptionType.Conflict,
		});
		expect(createPackageMock).not.toHaveBeenCalled();
		expect(updatedLinesMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('returns invalid operation when daily allocation does not contain all requested recipes', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const client = new Client('client-1', 'Alice');
		const address = new Address('address-1', 'calendar-1', date, 'Main St', 'Apt 12', new Coordinates(-17.79, -63.18), true);
		const dailyAllocation = new DailyAllocation('da-1', date, [
			new AllocationLine('line-1', 'da-1', 'client-1', 'recipe-1', 2, 0),
		]);

		getClientByIdMock.mockResolvedValue(client);
		getAddressByDateAndClientIdMock.mockResolvedValue(address);
		getPackageByAddressClientIdMock.mockResolvedValue(null);
		getDailyAllocationMock.mockResolvedValue(dailyAllocation);

		const result = await handler.handle(
			new CreatePackageCommand('order-1', 'client-1', date, ['recipe-1', 'recipe-2'])
		);

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'DailyAllocation.MissingRecipes',
			type: ExceptionType.InvalidOperation,
		});
		expect(createPackageMock).not.toHaveBeenCalled();
		expect(updatedLinesMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('creates package, updates lines, and writes outbox message when request is valid', async () => {
		const date = new Date('2026-04-25T00:00:00.000Z');
		const client = new Client('client-1', 'Alice');
		const address = new Address('address-1', 'calendar-1', date, 'Main St', 'Apt 12', new Coordinates(-17.79, -63.18), true);
		const dailyAllocation = new DailyAllocation('da-1', date, [
			new AllocationLine('line-1', 'da-1', 'client-1', 'recipe-1', 2, 0),
			new AllocationLine('line-2', 'da-1', 'client-1', 'recipe-2', 1, 0),
		]);

		getClientByIdMock.mockResolvedValue(client);
		getAddressByDateAndClientIdMock.mockResolvedValue(address);
		getPackageByAddressClientIdMock.mockResolvedValue(null);
		getDailyAllocationMock.mockResolvedValue(dailyAllocation);

		const result = await handler.handle(
			new CreatePackageCommand('order-1', 'client-1', date, ['recipe-1', 'recipe-2'])
		);

		expect(result.isSuccess).toBe(true);
		expect(createPackageMock).toHaveBeenCalledTimes(1);
		expect(updatedLinesMock).toHaveBeenCalledTimes(1);
		expect(outboxCreateMock).toHaveBeenCalledTimes(1);

		const createdPackage = createPackageMock.mock.calls[0][0];
		expect(createdPackage.getOrderId()).toBe('order-1');
		expect(createdPackage.getClientId()).toBe('client-1');
		expect(createdPackage.getAddressId()).toBe('address-1');
		expect(createdPackage.getListPackageItems()).toHaveLength(2);
		expect(createdPackage.getListPackageItems().map((item: { getRecipeId: () => string }) => item.getRecipeId())).toEqual([
			'recipe-1',
			'recipe-2',
		]);

		const updatedLines = dailyAllocation.getLines();
		expect(updatedLines[0]?.getQuantityPackaged()).toBe(2);
		expect(updatedLines[1]?.getQuantityPackaged()).toBe(1);

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});
});
