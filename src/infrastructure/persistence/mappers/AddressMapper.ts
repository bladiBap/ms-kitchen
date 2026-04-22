import { Address } from '@domain/address/entities/Address';
import { AddressEntity } from '@infrastructure/persistence/entities/Address';
import { Coordinates } from '@domain/address/values-objects/Coordinates';

export class AddressMapper {

	static toPersistence(order: Address): AddressEntity {
		const addressEntity = new AddressEntity();
		addressEntity.id = order.getId();
		addressEntity.calendarId = order.getCalendarId();
		addressEntity.date = order.getDate();
		addressEntity.address = order.getStreet();
		addressEntity.reference = order.getReference();
		addressEntity.latitude = order.getLocation().getLatitude();
		addressEntity.longitude = order.getLocation().getLongitude();
		addressEntity.needsDelivery = order.getNeedsDelivery();
		return addressEntity;
	}

	static toDomain(data: AddressEntity): Address {
		const coordinates = new Coordinates(data.latitude, data.longitude);
		return new Address(
			data.id,
			data.calendarId,
			data.date,
			data.address,
			data.reference,
			coordinates,
			data.needsDelivery
		);
	}
}
