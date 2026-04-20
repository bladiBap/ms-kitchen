import {
	Entity, PrimaryGeneratedColumn, OneToMany, OneToOne
} from 'typeorm';
import { MealPlanEntity } from './MealPlan';
import { AddressEntity } from './Address';

@Entity({
	name: 'calendar'
})
export class CalendarEntity{
    @PrimaryGeneratedColumn()
    	id!: string;

    @OneToOne(() => MealPlanEntity, (mealPlan) => mealPlan.calendar)
    	mealPlan!: MealPlanEntity;

    @OneToMany(() => AddressEntity, (address) => address.calendar)
    	addresses!: AddressEntity[];
}
