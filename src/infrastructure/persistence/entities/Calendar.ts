import {
	Entity, PrimaryGeneratedColumn, OneToMany, OneToOne,
	JoinColumn,
	ManyToOne,
	Column
} from 'typeorm';
import { MealPlanEntity } from './MealPlan';
import { AddressEntity } from './Address';
import { ClientEntity } from './Client';

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

	@ManyToOne(() => ClientEntity, (client) => client.calendars)
	@JoinColumn({ name: 'clientId' })
	client!: ClientEntity;

	@Column()
	clientId!: string;
}
