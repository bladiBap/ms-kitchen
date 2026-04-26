import 'reflect-metadata';

import { ExceptionType } from '@core/results/ExceptionType';

import { UpdateAddressCommand } from '@application/address/commands/updateAddress/UpdateAddressCommand';
import { UpdateAddressHandler } from '@application/address/commands/updateAddress/UpdateAddressHandler';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';

jest.mock('uuid', () => ({
	v4: jest.fn(() => 'mock-uuid'),
}));

describe('UpdateAddressHandler', () => {
	let getAddressByIdMock: jest.Mock;
	let updateAddressMock: jest.Mock;

	let addressRepository: IAddressRepository;

	let handler: UpdateAddressHandler;

	beforeEach(() => {
		getAddressByIdMock = jest.fn();
		updateAddressMock = jest.fn(async (entity) => entity);

		addressRepository = {
			getById: getAddressByIdMock,
			update: updateAddressMock,
		} as unknown as IAddressRepository;

		handler = new UpdateAddressHandler(addressRepository);
	});

	it('returns not found when address does not exist', async () => {
		getAddressByIdMock.mockResolvedValue(null);

		const result = await handler.handle(
			new UpdateAddressCommand(
				'address-missing',
				new Date('2026-04-25T00:00:00.000Z'),
				'Main St',
				'Apt 12',
				-17.79,
				-63.18,
				'calendar-1',
				true
			)
		);

		expect(result.isFailure).toBe(true);
		expect(result.error).toMatchObject({
			code: 'Address.NotFound',
			type: ExceptionType.NotFound,
		});
		expect(updateAddressMock).not.toHaveBeenCalled();
	});

	it('updates address when request is valid', async () => {
		const oldDate = new Date('2026-04-24T00:00:00.000Z');
		const newDate = new Date('2026-04-25T00:00:00.000Z');
		const address = new Address('address-1', 'calendar-1', oldDate, 'Old St', 'Old Ref', new Coordinates(-17.5, -63.0), true);

		getAddressByIdMock.mockResolvedValue(address);

		const result = await handler.handle(
			new UpdateAddressCommand(
				'address-1',
				newDate,
				'New St',
				'New Ref',
				-17.79,
				-63.18,
				'calendar-1',
				false
			)
		);

		expect(result.isSuccess).toBe(true);
		expect(address.getStreet()).toBe('New St');
		expect(address.getReference()).toBe('New Ref');
		expect(address.getDate()).toEqual(newDate);
		expect(address.getLocation().getLatitude()).toBe(-17.79);
		expect(address.getLocation().getLongitude()).toBe(-63.18);
		expect(updateAddressMock).toHaveBeenCalledTimes(1);
		expect(updateAddressMock).toHaveBeenCalledWith(address);
	});
});
