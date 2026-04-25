import { inject, injectable } from 'tsyringe';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Transactional } from '@application/common/decorator/Transactional';

import { Result } from '@core/results/Result';
import { CreateRecipeCommand } from '@application/recipe/commands/createRecipe/CreateRecipeCommand';
import { IRecipeRepository, IRecipeRepositoryToken } from '@domain/recipe/repositories/IRecipeRepository';
import { Recipe } from '@domain/recipe/entities/Recipe';

@injectable()
export class CreateRecipeHandler implements IRequestHandler <CreateRecipeCommand, Result> {

	constructor(
		@inject(IRecipeRepositoryToken) private readonly recipeRepository: IRecipeRepository,
	) {}

	@Transactional()
	async handle(createRecipeCommand: CreateRecipeCommand): Promise<Result> {

		const { id, name, instructions, ingredientsId } = createRecipeCommand;
		const recipe = Recipe.createNew(id, name, instructions);

		for (const ingredient of ingredientsId) {
			recipe.addIngredient(ingredient.id, ingredient.cantidadValor);
		}

		await this.recipeRepository.create(recipe);
		return Result.success();
	}
}
