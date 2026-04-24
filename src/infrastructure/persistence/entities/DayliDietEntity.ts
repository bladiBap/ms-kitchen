import {
	Entity, PrimaryColumn, Column, ManyToOne,
	OneToMany, JoinColumn
} from 'typeorm';

import { MealPlanEntity } from './MealPlanEntity';
import { DayliDietRecipeEntity } from './DayliDietRecipeEntity';

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

	@OneToMany(() => DayliDietRecipeEntity, (dayliDietRecipe) => dayliDietRecipe.dayliDiet, { cascade: true, eager: true })
		dayliDietRecipes!: DayliDietRecipeEntity[];
}
