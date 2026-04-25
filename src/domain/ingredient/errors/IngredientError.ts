import { Exception } from '@core/results/Exception';

export class IngredientError {

	static nameIsRequired() : Exception {
		return Exception.ValidationError('The ingredient name is required');
	}
}
