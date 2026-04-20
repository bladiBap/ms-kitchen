import {
	Entity, PrimaryGeneratedColumn, Column, ManyToOne,
	OneToMany, JoinColumn,
	OneToOne
} from 'typeorm';

import { DayliDietEntity } from './DayliDiet';
import { ClientEntity } from './Client';
import { CalendarEntity } from './Calendar';

@Entity({
	name: 'meal_plan'
})
export class MealPlanEntity {
    @PrimaryGeneratedColumn()
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
    @JoinColumn({ name: 'calendarId' })
    	calendar!: CalendarEntity;

    @ManyToOne(() => ClientEntity, (client) => client.mealPlans, { eager: true })
    @JoinColumn({ name: 'clientId' })
    	client!: ClientEntity;
}
