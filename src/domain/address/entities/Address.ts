import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '@core/abstraction/AgregateRoot';
import { Coordinates } from '@domain/address/values-objects/Coordinates';

export class Address extends AggregateRoot {

	private calendarId: string;
	private date : Date;
	private street: string;
	private reference: string;
	private location: Coordinates;

	constructor(id: string, calendarId: string, date: Date, street: string, reference: string, location: Coordinates) {
		super(id);
		this.calendarId = calendarId;
		this.date = date;
		this.street = street;
		this.reference = reference;
		this.location = location;
	}

	public static createNew(calendarId: string, date: Date, street: string, reference: string, location: Coordinates): Address {
		return new Address(uuidv4(), calendarId, date, street, reference, location);
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
}
