import { Result } from '@core/results/Result';
import { Exception } from '@core/results/Exception';
import { DomainException } from '@core/results/DomainException';

export function handlerError(error: unknown): Result {
	if (error instanceof DomainException) {
		return Result.failure(error.getException());
	} else {
		const exception = Exception.UnexpectedError();
		return Result.failure(exception);
	}
}
