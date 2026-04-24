import {
	Entity, PrimaryColumn, Column,
	OneToMany
} from 'typeorm';

import { RecipeIngredientEntity } from './RecipeIngredientEntity';
import { DayliDietRecipeEntity } from './DayliDietRecipeEntity';
import { PackageItemEntity } from './PackageItemEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { AllocationLineEntity } from './AllocationLineEntity';

@Entity({
	name: 'recipe'
})
export class RecipeEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	name!: string;

    @Column()
    	instructions!: string;

    @OneToMany(() => RecipeIngredientEntity, (recipeIngredient) => recipeIngredient.recipe, { cascade: true, eager: true })
    	ingredients!: RecipeIngredientEntity[];

    @OneToMany(() => PackageItemEntity, (packageItem) => packageItem.recipe)
    	packageItems!: PackageItemEntity[];

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.recipe)
    	orderItems!: OrderItemEntity[];

    @OneToMany(() => AllocationLineEntity, (allocationLine) => allocationLine.recipe)
    	allocationLines!: AllocationLineEntity[];

	@OneToMany(() => DayliDietRecipeEntity, (dayliDietRecipe) => dayliDietRecipe.recipe)
		dayliDietRecipes!: DayliDietRecipeEntity[];

}
