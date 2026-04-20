import { Exception } from '@core/results/Exception';

export class RecipeError {

	public static nameIsRequired(): Exception {
		return Exception.ValidationError('The name of the recipe is required.');
	}

	public static listOfIngredientsCannotBeEmpty(): Exception {
		return Exception.ValidationError('The list of ingredients cannot be empty.');
	}

	public static instructionsAreRequired(): Exception {
		return Exception.ValidationError('The instructions of the recipe are required.');
	}
}
