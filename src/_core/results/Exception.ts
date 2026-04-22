import { ExceptionType } from '@core/results/ExceptionType';

export class Exception {
	static readonly None = new Exception('', '', ExceptionType.Failure);
	static readonly NullValue = new Exception('General.Null', 'Null value was provided', ExceptionType.Failure);

	readonly codigo: string;
	readonly mensaje: string;
	readonly tipo: ExceptionType;

	protected constructor(code: string, structuredMessage: string, type: ExceptionType) {
		this.mensaje = structuredMessage ?? '';
		this.codigo = code;
		this.tipo = type;
	}

	static Failure(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.Failure);
	}

	static NotFound(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.NotFound);
	}

	static Problem(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.Problem);
	}

	static Conflict(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.Conflict);
	}

	static InvalidOperation(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.InvalidOperation);
	}

	static Unauthorized(code: string, structuredMessage: string): Exception {
		return new Exception(code, structuredMessage, ExceptionType.Unauthorized);
	}

	static ValidationError(structuredMessage: string): Exception {
		return new Exception('ValidationError', structuredMessage, ExceptionType.ValidationError);
	}

	static UnexpectedError(): Exception {
		return new Exception('UnexpectedError', 'A unexpected error occurred', ExceptionType.UnexpectedError);
	}
}
