import {
	Entity, PrimaryColumn, Column, ManyToOne,
	OneToMany, JoinColumn,
	OneToOne
} from 'typeorm';

import { DayliDietEntity } from './DayliDietEntity';
import { ClientEntity } from './ClientEntity';
import { CalendarEntity } from './CalendarEntity';

@Entity({
	name: 'meal_plan'
})
export class MealPlanEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column({ type: 'date' })
    	startDate!: Date;

    @Column({ type: 'date' })
    	endDate!: Date;

    @Column({ type: 'int' })
    	durationDays!: number;

    @OneToMany(() => DayliDietEntity, (dayliDiet) => dayliDiet.mealPlan, { cascade: true, eager: true })
    	dayliDiets!: DayliDietEntity[];

    @OneToOne(() => CalendarEntity, (calendar) => calendar.mealPlan, { cascade: true, eager: true })
    	calendar!: CalendarEntity;

    @ManyToOne(() => ClientEntity, (client) => client.mealPlans, { eager: true })
    @JoinColumn({ name: 'clientId' })
    	client!: ClientEntity;
}
