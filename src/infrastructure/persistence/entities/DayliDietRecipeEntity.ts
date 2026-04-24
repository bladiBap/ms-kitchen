import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DayliDietEntity } from './DayliDietEntity';
import { RecipeEntity } from './RecipeEntity';

@Entity({
	name: 'dayli_diet_recipes'
})
export class DayliDietRecipeEntity {
	@PrimaryColumn('uuid')
		dayliDietId!: string;

	@PrimaryColumn('uuid')
		recipeId!: string;

	@Column({ type: 'int' })
		quantity!: number;

	@ManyToOne(() => DayliDietEntity, (dayliDiet) => dayliDiet.dayliDietRecipes, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'dayliDietId' })
		dayliDiet!: DayliDietEntity;

	@ManyToOne(() => RecipeEntity, (recipe) => recipe.dayliDietRecipes)
	@JoinColumn({ name: 'recipeId' })
		recipe!: RecipeEntity;
}
