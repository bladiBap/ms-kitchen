import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { MeasurementUnitEntity } from './MeasurementUnit';
import { RecipeIngredientEntity } from './RecipeIngredient';

@Entity({
	name: 'ingredient'
})
export class IngredientEntity {
    @PrimaryGeneratedColumn()
    	id!: string;

    @Column()
    	name!: string;

    @ManyToOne(() => MeasurementUnitEntity, measurementUnit => measurementUnit.ingredients, { eager: true })
    @JoinColumn({ name: 'measurementUnitId' })
    	measurementUnit!: MeasurementUnitEntity;

    @OneToMany(() => RecipeIngredientEntity, (recipeIngredient) => recipeIngredient.ingredient)
    	recipes!: RecipeIngredientEntity[];
}
