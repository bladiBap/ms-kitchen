import { Response } from 'express';
import { Result } from '@core/results/Result';
import { ExceptionType } from '@core/results/ExceptionType';

export abstract class BaseController {
	protected handlerResponse<T extends Result>(response: Response<T>, result: T): Response<T> {
		if (result.isSuccess) {
			return response.status(200).json(result);
		}

		const excepcion = result.error;

		if (excepcion) {
			switch (excepcion.type) {
				case ExceptionType.Conflict:
					return response.status(409).json(result);
				case ExceptionType.NotFound:
					return response.status(404).json(result);
				case ExceptionType.Problem:
					return response.status(400).json(result);
				case ExceptionType.InvalidOperation:
					return response.status(422).json(result);
				case ExceptionType.Unauthorized:
					return response.status(401).json(result);
				default:
					return response.status(500).json(result);
			}
		} else {
			return response.status(500).json(result);
		}
	}
}
