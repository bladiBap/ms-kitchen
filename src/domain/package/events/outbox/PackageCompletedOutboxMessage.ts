import 'reflect-metadata';
import { Type } from 'class-transformer';
import { DomainEvent } from '@core/abstraction/DomainEvent';

class DeliveryAddress {
	latitude: string;
	longitude: string;

	constructor(latitude: string, longitude: string) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
}

class Item {
	recipeId: string;
	quantity: number;

	constructor(recipeId: string, quantity: number) {
		this.recipeId = recipeId;
		this.quantity = quantity;
	}
}

export class PackageCompletedOutboxMessage extends DomainEvent {
	customerId: string;
	deliveryAddress: string;

    @Type(() => Date)
    	deliveryDate: Date;

    @Type(() => DeliveryAddress)
    	deliveryLocation: DeliveryAddress;

    @Type(() => Date)
    	createdAt: Date;

    @Type(() => Item)
    	items: Item[];

    constructor(customerId: string, deliveryDate: Date, deliveryAddress: string, deliveryLocation: DeliveryAddress, createdAt: Date, items: Item[]) {
    	super();
    	this.customerId = customerId;
    	this.deliveryDate = deliveryDate;
    	this.deliveryAddress = deliveryAddress;
    	this.deliveryLocation = deliveryLocation;
    	this.createdAt = createdAt;
    	this.items = items;
    }
}
