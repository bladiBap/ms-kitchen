import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

class DeliveryLocation {
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

export class PackageCompletedIntegration extends IntegrationMessage {
	customerId: string;

	deliveryDate: Date;

	deliveryLocation: DeliveryLocation;

	deliveryAddress: string;

	override createdAt: Date;

	items: Item[];

	constructor(customerId: string, deliveryDate: Date, deliveryLocation: DeliveryLocation, deliveryAddress: string, createdAt: Date, items: Item[]) {
		super();
		this.customerId = customerId;
		this.deliveryDate = deliveryDate;
		this.deliveryLocation = deliveryLocation;
		this.deliveryAddress = deliveryAddress;
		this.createdAt = createdAt;
		this.items = items;
	}
}
