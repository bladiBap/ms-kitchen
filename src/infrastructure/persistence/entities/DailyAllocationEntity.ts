import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AllocationLineEntity } from './AllocationLineEntity';

@Entity({
	name: 'daily_allocation'
})
export class DailyAllocationEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column({ type: 'date' })
    	date!: Date;

    @OneToMany(() => AllocationLineEntity, l => l.allocation, { cascade: true, eager: true })
    	lines!: AllocationLineEntity[];

    @CreateDateColumn({ type: 'timestamptz' })
    	createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    	updatedAt!: Date;
}
