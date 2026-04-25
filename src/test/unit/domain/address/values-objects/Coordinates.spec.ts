import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { DomainException } from '@core/results/DomainException';
import { ExceptionType } from '@core/results/ExceptionType';

describe('Coordinates', () => {
	it('creates coordinates when latitude and longitude are within valid ranges', () => {
		const coordinates = new Coordinates(-90, 180);

		expect(coordinates.getLatitude()).toBe(-90);
		expect(coordinates.getLongitude()).toBe(180);
	});

	it('throws validation error for latitude below minimum', () => {
		expect(() => new Coordinates(-90.1, 10)).toThrow(DomainException);

		try {
			new Coordinates(-90.1, 10);
		} catch (error) {
			const domainException = error as DomainException;
			expect(domainException.getException()).toMatchObject({
				message: 'Invalid latitude value: -90.1. Latitude must be between -90 and 90 degrees.',
				type: ExceptionType.ValidationError,
			});
		}
	});

	it('throws validation error for latitude above maximum', () => {
		expect(() => new Coordinates(90.1, 10)).toThrow(DomainException);
	});

	it('throws validation error for longitude below minimum', () => {
		expect(() => new Coordinates(10, -180.1)).toThrow(DomainException);
	});

	it('throws validation error for longitude above maximum', () => {
		expect(() => new Coordinates(10, 180.1)).toThrow(DomainException);
	});

	it('returns true when comparing two coordinates with the same values', () => {
		const left = new Coordinates(-17.7833, -63.1821);
		const right = new Coordinates(-17.7833, -63.1821);

		expect(left.equals(right)).toBe(true);
	});

	it('returns false when comparing coordinates with different values', () => {
		const left = new Coordinates(-17.7833, -63.1821);
		const right = new Coordinates(-16.5, -68.15);

		expect(left.equals(right)).toBe(false);
	});

	it('returns false when comparing coordinates against null or undefined', () => {
		const coordinates = new Coordinates(-17.7833, -63.1821);

		expect(coordinates.equals(null as unknown as Coordinates)).toBe(false);
		expect(coordinates.equals(undefined as unknown as Coordinates)).toBe(false);
	});
});
