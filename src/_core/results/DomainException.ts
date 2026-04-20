import { Exception } from '@core/results/Exception';

export class DomainException extends Error {
	private exception: Exception;

	constructor(exception: Exception) {
		super(exception.mensaje);
		this.exception = exception;
	}

	getException(): Exception {
		return this.exception;
	}
}
