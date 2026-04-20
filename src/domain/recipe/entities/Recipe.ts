import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';
import { RecipeError } from '../errors/RecipeError';

export class Recipe extends Entity {

	private name : string;

	constructor(id: string, name: string) {
		super(id);
		if (name.trim().length === 0) {
			throw new DomainException(RecipeError.nameIsRequired());
		}

		this.name = name;
	}

	public getName() : string {
		return this.name;
	}
}
