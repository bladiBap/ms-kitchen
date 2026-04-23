import {
	Entity, PrimaryColumn, Column, ManyToOne,
	ManyToMany, JoinTable, JoinColumn
} from 'typeorm';

import { RecipeEntity } from './RecipeEntity';
import { MealPlanEntity } from './MealPlanEntity';

@Entity({
	name: 'dayli_diet'
})
export class DayliDietEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column({ type: 'date' })
    	date!: Date;

    @Column()
    	nDayPlan!: number;

    @ManyToOne(() => MealPlanEntity, (mealPlan) => mealPlan.dayliDiets)
    @JoinColumn({ name: 'mealPlanId' })
    	mealPlan!: MealPlanEntity;


    @ManyToMany(() => RecipeEntity, (recipe) => recipe.dayliDiets, { cascade: true, eager: true })
    @JoinTable({
    	name: 'dayli_diet_recipes',
    	joinColumn: { name: 'dayliDietId', referencedColumnName: 'id' },
    	inverseJoinColumn: { name: 'recipeId', referencedColumnName: 'id' }
    })
    	recipes!: RecipeEntity[];
}
