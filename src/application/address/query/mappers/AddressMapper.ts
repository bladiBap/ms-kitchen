import { AddressDTO } from '@application/address/dto/AddressDto';
import { DateUtils } from '@shared/utils/Date';
import { AddressEntity } from '@infrastructure/persistence/entities/Address';

export class AddressDTOMapper {
	static toDTO(address: AddressEntity): AddressDTO {
		return {
			id: address.id,
			date: DateUtils.formatDate(address.date).toString(),
			reference: address.reference,
			latitude: address.latitude,
			longitude: address.longitude,
			calendarId: address.calendarId,
			needsDelivery: address.needsDelivery
		};
	}
}
