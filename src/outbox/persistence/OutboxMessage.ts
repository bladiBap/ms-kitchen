import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'outbox_messages'
})
export class OutboxMessageEntity {
    @PrimaryGeneratedColumn('uuid')
    	id!: string;

    @Column({ type: 'jsonb' })
    	content!: Record<string, unknown>;

    @Column()
    	type!: string;

    @Column({ type: 'timestamp' })
    	created!: Date;

    @Column({ default: false })
    	processed!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    	processedOn?: Date;

    @Column({ nullable: true })
    	correlationId?: string;

    @Column({ nullable: true })
    	traceId?: string;

    @Column({ nullable: true })
    	spanId?: string;
}
