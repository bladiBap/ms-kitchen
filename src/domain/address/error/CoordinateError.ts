import { Exception } from '@core/results/Exception';
export class CoordinateError {

	public static invalidLatitude(latitude: number): Exception {
		return Exception.ValidationError(`Invalid latitude value: ${latitude}. Latitude must be between -90 and 90 degrees.`);
	}

	public static invalidLongitude(longitude: number): Exception {
		return Exception.ValidationError(`Invalid longitude value: ${longitude}. Longitude must be between -180 and 180 degrees.`);
	}
}
