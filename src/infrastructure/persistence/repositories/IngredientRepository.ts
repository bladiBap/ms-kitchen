import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Ingredient } from '@domain/ingredient/entities/Ingredient';
import { IIngredientRepository } from '@domain/ingredient/repositories/IIngredientRepository';
import { IngredientMapper } from '@infrastructure/persistence/mappers/IngredientMapper';
import { IngredientEntity } from '../entities/IngredientEntity';

@injectable()
export class IngredientRepository implements IIngredientRepository {

	constructor(
		@inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}


	async create(ingredient: Ingredient): Promise<void> {
		const manager = this.emProvider.getManager();
		const ingredientRepository = manager.getRepository(IngredientEntity);
		const ingredientEntity = IngredientMapper.toPersistence(ingredient);
		await ingredientRepository.save(ingredientEntity);
	}

	async getById(id: string): Promise<Ingredient | null> {
		const manager = this.emProvider.getManager();
		const ingredientRepository = manager.getRepository(IngredientEntity);
		const ingredientEntity = await ingredientRepository.findOne({ where: { id } });
		if (!ingredientEntity) {
			return null;
		}
		return IngredientMapper.toDomain(ingredientEntity);
	}
}
