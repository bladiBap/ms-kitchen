import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IngredientEntity } from './Ingredient';

@Entity({
	name: 'measurement_unit'
})
export class MeasurementUnitEntity {
    @PrimaryGeneratedColumn()
    	id!: string;

    @Column()
    	name!: string;

    @Column()
    	simbol!: string;

    @OneToMany(() => IngredientEntity, (ingredient) => ingredient.measurementUnit)
    	ingredients!: IngredientEntity[];
}
