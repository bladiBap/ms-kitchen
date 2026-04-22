import { Exception } from '@core/results/Exception';

export class ClientError {

	public static nameIsRequired(): Exception {
		return Exception.ValidationError('The name of the client is required.');
	}

	public static alreadyExists(): Exception {
		return Exception.Conflict(
			'ClientAlreadyExists',
			'A client with the same name already exists.'
		);
	}
}
