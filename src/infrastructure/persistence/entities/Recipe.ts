import {
	Entity, PrimaryGeneratedColumn, Column,
	OneToMany, ManyToMany
} from 'typeorm';

import { RecipeIngredientEntity } from './RecipeIngredient';
import { DayliDietEntity } from './DayliDiet';
import { PackageItemEntity } from './PackageItem';
import { OrderItemEntity } from './OrderItem';
import { AllocationLineEntity } from './AllocationLine';

@Entity({
	name: 'recipe'
})
export class RecipeEntity {
    @PrimaryGeneratedColumn()
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
