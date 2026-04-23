import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { IngredientEntity } from './IngredientEntity';

@Entity({
	name: 'measurement_unit'
})
export class MeasurementUnitEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	name!: string;

    @Column()
    	simbol!: string;

    @OneToMany(() => IngredientEntity, (ingredient) => ingredient.measurementUnit)
    	ingredients!: IngredientEntity[];
}
