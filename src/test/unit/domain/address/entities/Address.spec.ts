import { v4 as uuidv4 } from 'uuid';

import { Address } from '@domain/address/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

const mockedUuidv4 = uuidv4 as unknown as jest.Mock;

describe('Address', () => {
	beforeEach(() => {
		mockedUuidv4.mockReset();
	});

	it('creates a new address with generated id and delivery enabled by default', () => {
		mockedUuidv4.mockReturnValue('address-id-1');
		const location = new Coordinates(-17.7833, -63.1821);

		const address = Address.createNew(
			'calendar-1',
			new Date('2026-04-25T00:00:00.000Z'),
			'Av. Bush #123',
			'Near the park',
			location
		);

		expect(address.getId()).toBe('address-id-1');
		expect(address.getCalendarId()).toBe('calendar-1');
		expect(address.getStreet()).toBe('Av. Bush #123');
		expect(address.getReference()).toBe('Near the park');
		expect(address.getLocation()).toBe(location);
		expect(address.getNeedsDelivery()).toBe(true);
	});

	it('updates mutable fields through setters', () => {
		const initialLocation = new Coordinates(-17.7, -63.1);
		const newLocation = new Coordinates(-16.5, -68.15);
		const address = new Address(
			'address-1',
			'calendar-1',
			new Date('2026-04-25T00:00:00.000Z'),
			'Street A',
			'Reference A',
			initialLocation,
			true
		);

		address.setStreet('Street B');
		address.setReference('Reference B');
		address.setDate(new Date('2026-04-26T00:00:00.000Z'));
		address.setLocation(newLocation);
		address.setNeedsDelivery(false);

		expect(address.getStreet()).toBe('Street B');
		expect(address.getReference()).toBe('Reference B');
		expect(address.getDate()).toEqual(new Date('2026-04-26T00:00:00.000Z'));
		expect(address.getLocation()).toBe(newLocation);
		expect(address.getNeedsDelivery()).toBe(false);
	});

	it('throws validation error when creating with invalid street', () => {
		const location = new Coordinates(-17.7833, -63.1821);

		expect(() => Address.createNew('calendar-1', new Date('2026-04-25T00:00:00.000Z'), '   ', 'ref', location)).toThrow(DomainException);

		try {
			Address.createNew('calendar-1', new Date('2026-04-25T00:00:00.000Z'), '   ', 'ref', location);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Invalid street value:    . Street is required.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws validation error when creating with invalid reference', () => {
		const location = new Coordinates(-17.7833, -63.1821);

		expect(() => Address.createNew('calendar-1', new Date('2026-04-25T00:00:00.000Z'), 'street', '', location)).toThrow(DomainException);

		try {
			Address.createNew('calendar-1', new Date('2026-04-25T00:00:00.000Z'), 'street', '', location);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Invalid reference value: . Reference is required.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws validation error when setting invalid street', () => {
		const address = new Address(
			'address-1',
			'calendar-1',
			new Date('2026-04-25T00:00:00.000Z'),
			'Street A',
			'Reference A',
			new Coordinates(-17.7, -63.1),
			true
		);

		expect(() => address.setStreet('')).toThrow(DomainException);
	});

	it('throws validation error when setting invalid reference', () => {
		const address = new Address(
			'address-1',
			'calendar-1',
			new Date('2026-04-25T00:00:00.000Z'),
			'Street A',
			'Reference A',
			new Coordinates(-17.7, -63.1),
			true
		);

		expect(() => address.setReference('   ')).toThrow(DomainException);
	});
});
