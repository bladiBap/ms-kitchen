import { v4 as uuidv4 } from 'uuid';

import { AggregateRoot } from '@core/abstraction/AgregateRoot';
import { DomainException } from '@core/results/DomainException';

import { Coordinates } from '@domain/address/values-objects/Coordinates';
import { AddressError } from '@domain/address/error/AddressError';

export class Address extends AggregateRoot {

	private calendarId: string;
	private date : Date;
	private street: string;
	private reference: string;
	private location: Coordinates;
	private needsDelivery: boolean;

	constructor(id: string, calendarId: string, date: Date, street: string, reference: string, location: Coordinates, needsDelivery: boolean) {
		super(id);
		this.calendarId = calendarId;
		this.date = date;
		this.street = street;
		this.reference = reference;
		this.location = location;
		this.needsDelivery = needsDelivery;
	}

	public static createNew(calendarId: string, date: Date, street: string, reference: string, location: Coordinates): Address {
		Address.validateStreet(street);
		Address.validateReference(reference);
		return new Address(uuidv4(), calendarId, date, street, reference, location, true);
	}

	public getCalendarId(): string {
		return this.calendarId;
	}

	public getDate(): Date {
		return this.date;
	}

	public getStreet(): string {
		return this.street;
	}

	public getReference(): string {
		return this.reference;
	}

	public getLocation(): Coordinates {
		return this.location;
	}

	public getNeedsDelivery(): boolean {
		return this.needsDelivery;
	}

	public setLocation(location: Coordinates): void {
		this.location = location;
	}

	public setStreet(street: string): void {
		Address.validateStreet(street);
		this.street = street;
	}

	public setReference(reference: string): void {
		Address.validateReference(reference);
		this.reference = reference;
	}

	public setDate(date: Date): void {
		this.date = date;
	}

	public setNeedsDelivery(needsDelivery: boolean): void {
		this.needsDelivery = needsDelivery;
	}

	private static validateStreet(street: string): void {
		if (!street || street.trim() === '') {
			throw new DomainException(AddressError.invalidStreet(street));
		}
	}

	private static validateReference(reference: string): void {
		if (!reference || reference.trim() === '') {
			throw new DomainException(AddressError.invalidReference(reference));
		}
	}
}
