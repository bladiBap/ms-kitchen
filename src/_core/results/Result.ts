import { Exception } from '@core/results/Exception';

export class Result {
	readonly isSuccess: boolean;
	readonly error?: Exception;

	protected constructor(isSuccess: boolean, error: Exception) {
		if ((isSuccess && error !== Exception.None) || (!isSuccess && error === Exception.None)) {
			throw new Error('Invalid error state in Result, isSuccess: ' + isSuccess + ', error: ' + error);
		}
		this.isSuccess = isSuccess;
		this.error = error === Exception.None ? undefined : error;
	}

	get isFailure(): boolean {
		return !this.isSuccess;
	}

	static success(): Result {
		return new Result(true, Exception.None);
	}

	static successWith<T>(value: T): ResultWithValue<T> {
		return new ResultWithValue<T>(value, true, Exception.None);
	}

	static failure(error: Exception): Result {
		return new Result(false, error);
	}

	static failureWith<T>(error: Exception): ResultWithValue<T> {
		return new ResultWithValue<T>(undefined, false, error);
	}
}

export class ResultWithValue<T> extends Result {
	private readonly value?: T;

	constructor(value: T | undefined, isSuccess: boolean, error: Exception) {
		super(isSuccess, error);
		this.value = value;
	}

	getValue(): T {
		if (!this.isSuccess) {
			throw new Error('The value of a failure result cant be accessed.');
		}
		return this.value as T;
	}

	static validationFailure<T>(error: Exception): ResultWithValue<T> {
		return new ResultWithValue<T>(undefined, false, error);
	}

	static fromValue<T>(value: T | null | undefined): ResultWithValue<T> {
		return value !== null && value !== undefined
			? Result.successWith(value as T)
			: Result.failureWith<T>(Exception.NullValue);
	}
}
