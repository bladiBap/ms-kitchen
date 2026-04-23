import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DailyAllocationEntity } from './DailyAllocationEntity';
import { ClientEntity } from './ClientEntity';
import { RecipeEntity } from './RecipeEntity';

@Entity({
	name: 'allocation_line'
})
export class AllocationLineEntity {

    @PrimaryColumn('uuid')
    	id!: string;

    @ManyToOne(() => DailyAllocationEntity, a => a.lines)
    @JoinColumn({ name: 'allocationId' })
    	allocation!: DailyAllocationEntity;

    @Column({
    	name: 'allocationId',
    })
    	allocationId!: string;

    @ManyToOne(() => ClientEntity)
    @JoinColumn({ name: 'clientId' })
    	client!: ClientEntity;

    @Column({
    	name: 'clientId',
    })
    	clientId!: string;

    @ManyToOne(() => RecipeEntity)
    @JoinColumn({ name: 'recipeId' })
    	recipe!: RecipeEntity;

    @Column({
    	name: 'recipeId',
    })
    	recipeId!: string;

    @Column({ type: 'int' })
    	quantityNeeded!: number;

    @Column({ type: 'int', default: 0 })
    	quantityPackaged!: number;
}
