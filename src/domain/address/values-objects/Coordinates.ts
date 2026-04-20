import { ValueObject } from '@core/abstraction/ValueObject';
import { DomainException } from '@core/results/DomainException';
import { CoordinateError } from '@domain/address/error/CoordinateError';

export class Coordinates extends ValueObject {
	private latitude: number;
	private longitude: number;

	constructor(latitude: number, longitude: number) {
		super();

		if (latitude < -90 || latitude > 90) {
			throw new DomainException(CoordinateError.invalidLatitude(latitude));
		}
		if (longitude < -180 || longitude > 180) {
			throw new DomainException(CoordinateError.invalidLongitude(longitude));
		}

		this.latitude = latitude;
		this.longitude = longitude;
	}

	public getLatitude(): number {
		return this.latitude;
	}

	public getLongitude(): number {
		return this.longitude;
	}
}
