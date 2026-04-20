import {
	Entity, PrimaryGeneratedColumn, Column, OneToMany
} from 'typeorm';

import { MealPlanEntity } from './MealPlan';
import { PackageEntity } from './Package';
import { AllocationLineEntity } from './AllocationLine';

@Entity({
	name: 'client'
})
export class ClientEntity {
    @PrimaryGeneratedColumn()
    	id!: string;

    @Column()
    	name!: string;

    @OneToMany(() => MealPlanEntity, (mealPlan) => mealPlan.client, { cascade: true })
    	mealPlans!: MealPlanEntity[];

    @OneToMany(() => PackageEntity, (packag) => packag.client, { cascade: true, eager: true })
    	packages!: PackageEntity[];

    @OneToMany(() => AllocationLineEntity, (allocationLine) => allocationLine.client)
    	allocationLines!: AllocationLineEntity[];
}
