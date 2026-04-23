import {
	Entity, PrimaryColumn, OneToMany, OneToOne,
	JoinColumn,
	ManyToOne,
	Column
} from 'typeorm';
import { ClientEntity } from './ClientEntity';
import { AddressEntity } from './AddressEntity';
import { MealPlanEntity } from './MealPlanEntity';

@Entity({
	name: 'calendar'
})
export class CalendarEntity{
	@PrimaryColumn('uuid')
    	id!: string;

    @OneToOne(() => MealPlanEntity, (mealPlan) => mealPlan.calendar)
	@JoinColumn({ name: 'mealPlanId' })
    	mealPlan!: MealPlanEntity;

    @OneToMany(() => AddressEntity, (address) => address.calendar)
    	addresses!: AddressEntity[];

	@ManyToOne(() => ClientEntity, (client) => client.calendars)
	@JoinColumn({ name: 'clientId' })
	client!: ClientEntity;

	@Column()
	clientId!: string;
}
