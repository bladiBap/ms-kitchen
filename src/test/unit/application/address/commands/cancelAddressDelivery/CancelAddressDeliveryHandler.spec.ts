import 'reflect-metadata';

import { ExceptionType } from '@core/results/ExceptionType';

import { CancelAddressDeliveryCommand } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryCommand';
import { CancelAddressDeliveryHandler } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryHandler';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('CancelAddressDeliveryHandler', () => {
	let getAddressByIdMock: jest.Mock;
	let updateAddressMock: jest.Mock;

	let addressRepository: IAddressRepository;

	let handler: CancelAddressDeliveryHandler;

	beforeEach(() => {
		getAddressByIdMock = jest.fn();
		updateAddressMock = jest.fn(async (entity) => entity);

		addressRepository = {
			getById: getAddressByIdMock,
			update: updateAddressMock,
		} as unknown as IAddressRepository;

		handler = new CancelAddressDeliveryHandler(addressRepository);
	});

	it('returns not found when address does not exist', async () => {
		getAddressByIdMock.mockResolvedValue(null);

		const result = await handler.handle(new CancelAddressDeliveryCommand('calendar-1', 'missing-address'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Address.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(updateAddressMock).not.toHaveBeenCalled();
	});

	it('returns validation error when address does not belong to calendar', async () => {
		const address = new Address(
			'address-1',
			'calendar-2',
			new Date('2026-04-25T00:00:00.000Z'),
			'Main St',
			'Apt 12',
			new Coordinates(-17.79, -63.18),
			true
		);

		getAddressByIdMock.mockResolvedValue(address);

		const result = await handler.handle(new CancelAddressDeliveryCommand('calendar-1', 'address-1'));

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'ValidationError',
			type: ExceptionType.ValidationError,
		});
		expect(updateAddressMock).not.toHaveBeenCalled();
	});

	it('disables delivery and updates address when request is valid', async () => {
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

		const result = await handler.handle(new CancelAddressDeliveryCommand('calendar-1', 'address-1'));

		expect(result.isSuccess).toBe(true);
		expect(address.getNeedsDelivery()).toBe(false);
		expect(updateAddressMock).toHaveBeenCalledTimes(1);
		expect(updateAddressMock).toHaveBeenCalledWith(address);
	});
});
