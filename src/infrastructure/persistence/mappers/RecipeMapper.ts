import { Recipe } from '@domain/recipe/entities/Recipe';
import { RecipeIngredient } from '@domain/recipe/entities/RecipeIngredient';
import { RecipeEntity } from '@infrastructure/persistence/entities/RecipeEntity';
import { RecipeIngredientEntity } from '../entities/RecipeIngredientEntity';
import { IngredientEntity } from '../entities/IngredientEntity';

export class RecipeMapper {

	static toDomain(recipeEntity: RecipeEntity): Recipe {
		return new Recipe(
			recipeEntity.id,
			recipeEntity.name,
			recipeEntity.instructions,
			recipeEntity.ingredients.map(ri => new RecipeIngredient(ri.id, ri.ingredient.id, ri.quantity))
		);
	}

	static toPersistence(recipe: Recipe): RecipeEntity {
		const recipeEntity = new RecipeEntity();
		recipeEntity.id = recipe.id;
		recipeEntity.name = recipe.getName();
		recipeEntity.instructions = recipe.getInstructions();
		recipeEntity.ingredients = recipe.getIngredients().map(ri => {

			const ingredientEntity = new IngredientEntity();
			ingredientEntity.id = ri.getIngredientId();

			const recipeIngredientEntity = new RecipeIngredientEntity();
			recipeIngredientEntity.id = ri.id;
			recipeIngredientEntity.ingredient = ingredientEntity;
			recipeIngredientEntity.quantity = ri.getQuantity();

			return recipeIngredientEntity;
		});
		return recipeEntity;
	}
}
