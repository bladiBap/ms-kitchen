import { ValueObject } from '@core/abstraction/ValueObject';
import { Coordinates } from '@domain/address/values-objects/Coordinates';

export class AddressVO extends ValueObject {
	private street: string;
	private city: string;
	private location: Coordinates;

	constructor(street: string, city: string, location: Coordinates) {
		super();
		if (street.trim().length === 0) {
			throw new Error('Street is required.');
		}
		if (city.trim().length === 0) {
			throw new Error('City is required.');
		}
		this.street = street;
		this.city = city;
		this.location = location;
	}

	public getStreet(): string {
		return this.street;
	}

	public getLocation(): Coordinates {
		return this.location;
	}

	public getCity(): string {
		return this.city;
	}
}
