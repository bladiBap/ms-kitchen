import {
	Entity, Column,
	ManyToOne, JoinColumn, OneToOne,
	PrimaryColumn
} from 'typeorm';
import { CalendarEntity } from './CalendarEntity';
import { PackageEntity } from './PackageEntity';

@Entity({
	name: 'address'
})
export class AddressEntity{
    @PrimaryColumn('uuid')
    	id!: string;

    @Column({ type: 'date' })
    	date!: Date;

    @Column()
    	address!: string;

    @Column()
    	reference!: string;

    @Column({ type: 'float' })
    	latitude!: number;

    @Column({ type: 'float' })
    	longitude!: number;

	@Column({ default: true })
	needsDelivery!: boolean;

    @ManyToOne(() => CalendarEntity, (calendar) => calendar.addresses)
    @JoinColumn({ name: 'calendarId' })
    	calendar!: CalendarEntity;

    @Column()
    	calendarId!: string;

    @OneToOne(() => PackageEntity, (packag) => packag.address)
    	package!: PackageEntity;
}
