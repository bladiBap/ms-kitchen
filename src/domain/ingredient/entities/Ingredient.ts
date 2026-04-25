import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';
import { IngredientError } from '../errors/IngredientError';

export class Ingredient extends Entity {

	private name : string;
	private unitOfMeasureId : number;

	constructor(id: string, name: string, unitOfMeasureId: number) {
		super(id);
		this.name = name;
		this.unitOfMeasureId = unitOfMeasureId;
	}

	static createNew(id: string, name: string, unitOfMeasureId: number) : Ingredient {
		this.validateName(name);
		return new Ingredient(id, name, unitOfMeasureId);
	}

	static validateName(name: string) : void {
		if (name === undefined || name === null) {
			throw new DomainException(IngredientError.nameIsRequired());
		}

		if (name.trim().length === 0) {
			throw new DomainException(IngredientError.nameIsRequired());
		}
	}

	getName(): string {
		return this.name;
	}

	getUnitOfMeasureId(): number {
		return this.unitOfMeasureId;
	}
}
