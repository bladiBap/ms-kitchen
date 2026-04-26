import 'reflect-metadata';

import { container } from 'tsyringe';

import { IUnitOfWork, IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { ExceptionType } from '@core/results/ExceptionType';

import { CreateAddressCommand } from '@application/address/commands/createAddress/CreateAddressCommand';
import { CreateAddressHandler } from '@application/address/commands/createAddress/CreateAddressHandler';

import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('CreateAddressHandler', () => {
	let createAddressMock: jest.Mock;

	let startMock: jest.Mock;
	let commitMock: jest.Mock;
	let rollbackMock: jest.Mock;

	let addressRepository: IAddressRepository;

	let handler: CreateAddressHandler;

	beforeEach(() => {
		createAddressMock = jest.fn(async (entity) => entity);

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
			create: createAddressMock,
		} as unknown as IAddressRepository;

		handler = new CreateAddressHandler(addressRepository);
	});

	it('creates address and commits when request is valid', async () => {
		const result = await handler.handle(
			new CreateAddressCommand(
				new Date('2026-04-25T00:00:00.000Z'),
				'Main St',
				'Apt 12',
				-17.79,
				-63.18,
				'calendar-1'
			)
		);

		expect(result.isSuccess).toBe(true);
		expect(createAddressMock).toHaveBeenCalledTimes(1);

		const createdAddress = createAddressMock.mock.calls[0][0];
		expect(createdAddress.getCalendarId()).toBe('calendar-1');
		expect(createdAddress.getStreet()).toBe('Main St');
		expect(createdAddress.getReference()).toBe('Apt 12');

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(commitMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).not.toHaveBeenCalled();
	});

	it('returns validation failure and rolls back when coordinates are invalid', async () => {
		const result = await handler.handle(
			new CreateAddressCommand(
				new Date('2026-04-25T00:00:00.000Z'),
				'Main St',
				'Apt 12',
				120,
				-63.18,
				'calendar-1'
			)
		);

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'ValidationError',
			type: ExceptionType.ValidationError,
		});
		expect(createAddressMock).not.toHaveBeenCalled();

		expect(startMock).toHaveBeenCalledTimes(1);
		expect(rollbackMock).toHaveBeenCalledTimes(1);
		expect(commitMock).not.toHaveBeenCalled();
	});
});
