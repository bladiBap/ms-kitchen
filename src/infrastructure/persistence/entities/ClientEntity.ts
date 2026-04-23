import {
	Entity, Column, OneToMany,
	PrimaryColumn
} from 'typeorm';

import { MealPlanEntity } from './MealPlanEntity';
import { PackageEntity } from './PackageEntity';
import { AllocationLineEntity } from './AllocationLineEntity';
import { CalendarEntity } from './CalendarEntity';

@Entity({
	name: 'client'
})
export class ClientEntity {
    @PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	name!: string;

    @OneToMany(() => MealPlanEntity, (mealPlan) => mealPlan.client, { cascade: true })
    	mealPlans!: MealPlanEntity[];

    @OneToMany(() => PackageEntity, (packag) => packag.client, { cascade: true, eager: true })
    	packages!: PackageEntity[];

    @OneToMany(() => AllocationLineEntity, (allocationLine) => allocationLine.client)
    	allocationLines!: AllocationLineEntity[];

	@OneToMany(() => CalendarEntity, (calendar) => calendar.client)
	calendars!: CalendarEntity[];
}
