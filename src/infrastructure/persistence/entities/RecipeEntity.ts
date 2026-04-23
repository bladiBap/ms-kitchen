import {
	Entity, PrimaryColumn, Column,
	OneToMany, ManyToMany
} from 'typeorm';

import { RecipeIngredientEntity } from './RecipeIngredientEntity';
import { DayliDietEntity } from './DayliDietEntity';
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

    @ManyToMany(() => DayliDietEntity, (dayliDiet) => dayliDiet.recipes)
    	dayliDiets!: DayliDietEntity[];

}
