import { Exception } from '@core/results/Exception';
export class AddressError {

	public static invalidStreet(street: string): Exception {
		return Exception.ValidationError(`Invalid street value: ${street}. Street is required.`);
	}

	public static invalidReference(reference: string): Exception {
		return Exception.ValidationError(`Invalid reference value: ${reference}. Reference is required.`);
	}
}
