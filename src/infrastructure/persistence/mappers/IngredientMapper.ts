import { Ingredient } from '@domain/ingredient/entities/Ingredient';
import { IngredientEntity } from '@infrastructure/persistence/entities/IngredientEntity';
import { MeasurementUnitEntity } from '../entities/MeasurementUnitEntity';

export class IngredientMapper {

	static toDomain(ingredientEntity: IngredientEntity): Ingredient {
		const ingredient = new Ingredient(
			ingredientEntity.id,
			ingredientEntity.name,
			ingredientEntity.measurementUnit.id
		);
		return ingredient;
	}

	static toPersistence(ingredient: Ingredient): IngredientEntity {

		const measurementUnitEntity = new MeasurementUnitEntity();
		measurementUnitEntity.id = ingredient.getUnitOfMeasureId();

		const ingredientEntity = new IngredientEntity();
		ingredientEntity.id = ingredient.id;
		ingredientEntity.name = ingredient.getName();
		ingredientEntity.measurementUnit = measurementUnitEntity;

		return ingredientEntity;
	}
}
