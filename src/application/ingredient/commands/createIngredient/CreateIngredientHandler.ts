import { inject, injectable } from 'tsyringe';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { Transactional } from '@application/common/decorator/Transactional';
import { CreateIngredientCommand } from '@application/ingredient/commands/createIngredient/CreateIngredientCommand';

import { Result } from '@core/results/Result';
import { Ingredient } from '@domain/ingredient/entities/Ingredient';
import { IIngredientRepository, IIngredientRepositoryToken } from '@domain/ingredient/repositories/IIngredientRepository';

@injectable()
export class CreateIngredientHandler implements IRequestHandler <CreateIngredientCommand, Result> {

	constructor(
		@inject(IIngredientRepositoryToken) private readonly ingredientRepository: IIngredientRepository
	) {}

	@Transactional()
	async handle(createIngredientCommand: CreateIngredientCommand): Promise<Result> {

		const { id, name, unitOfMeasureId } = createIngredientCommand;
		const ingredient = Ingredient.createNew(id, name, unitOfMeasureId);
		await this.ingredientRepository.create(ingredient);

		return Result.success();
	}
}
