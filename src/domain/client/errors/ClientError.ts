import { Exception } from '@core/results/Exception';

export class ClientError {

	public static nameIsRequired(): Exception {
		return Exception.ValidationError('The name of the client is required.');
	}
}
