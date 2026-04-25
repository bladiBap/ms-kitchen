import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { IngredientEntity } from './IngredientEntity';

@Entity({
	name: 'measurement_unit'
})
export class MeasurementUnitEntity {
	@PrimaryColumn('int')
	id!: number;

	@Column()
	name!: string;

	@Column()
	simbol!: string;

	@OneToMany(() => IngredientEntity, (ingredient) => ingredient.measurementUnit)
	ingredients!: IngredientEntity[];
}
