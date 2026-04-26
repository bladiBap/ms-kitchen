import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { DeleteAddressCommand } from '@application/address/commands/deleteAddress/DeleteAddressCommand';
import { DeleteAddressHandler } from '@application/address/commands/deleteAddress/DeleteAddressHandler';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('DeleteAddressHandler', () => {
	let getAddressByIdMock: jest.Mock;
	let deleteAddressMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let addressRepository: IAddressRepository;

	let handler: DeleteAddressHandler;

	beforeEach(() => {
		getAddressByIdMock = jest.fn();
		deleteAddressMock = jest.fn(async () => undefined);

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

		addressRepository = {
			getById: getAddressByIdMock,
			delete: deleteAddressMock,
		} as unknown as IAddressRepository;

		handler = new DeleteAddressHandler(addressRepository);
	});

	it('returns not found when address does not exist', async () => {
		getAddressByIdMock.mockResolvedValue(null);

		const result = await handler.handle(new DeleteAddressCommand('missing-address'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Address.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(deleteAddressMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});

	it('deletes address and commits when request is valid', async () => {
		const address = new Address(
			'address-1',
			'calendar-1',
			new Date('2026-04-25T00:00:00.000Z'),
			'Main St',
			'Apt 12',
			new Coordinates(-17.79, -63.18),
			true
		);

		getAddressByIdMock.mockResolvedValue(address);

		const result = await handler.handle(new DeleteAddressCommand('address-1'));

		expect(result.isSuccess).toBe(true);
		expect(deleteAddressMock).toHaveBeenCalledTimes(1);
		expect(deleteAddressMock).toHaveBeenCalledWith('address-1');

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});
});
