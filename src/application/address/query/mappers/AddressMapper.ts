import { AddressDTO } from '@application/address/dto/AddressDto';
import { DateUtils } from '@common/Utils/Date';
import { Address } from '@infrastructure/Persistence/PersistenceModel/Entities/Address';

export class AddressDTOMapper {
	static toDTO(address: Address): AddressDTO {
		return {
			id: address.id,
			date: DateUtils.formatDate(address.date).toString(),
			reference: address.reference,
			latitude: address.latitude,
			longitude: address.longitude,
			calendarId: address.calendarId
		};
	}
}
