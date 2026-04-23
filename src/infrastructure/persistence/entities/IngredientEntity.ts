import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { MeasurementUnitEntity } from './MeasurementUnitEntity';
import { RecipeIngredientEntity } from './RecipeIngredientEntity';

@Entity({
	name: 'ingredient'
})
export class IngredientEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	name!: string;

    @ManyToOne(() => MeasurementUnitEntity, measurementUnit => measurementUnit.ingredients, { eager: true })
    @JoinColumn({ name: 'measurementUnitId' })
    	measurementUnit!: MeasurementUnitEntity;

    @OneToMany(() => RecipeIngredientEntity, (recipeIngredient) => recipeIngredient.ingredient)
    	recipes!: RecipeIngredientEntity[];
}
