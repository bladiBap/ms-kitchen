import {
	Entity, PrimaryGeneratedColumn, Column,
	ManyToOne, JoinColumn, OneToOne
} from 'typeorm';
import { CalendarEntity } from './Calendar';
import { PackageEntity } from './Package';

@Entity({
	name: 'address'
})
export class AddressEntity{
    @PrimaryGeneratedColumn()
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

    @ManyToOne(() => CalendarEntity, (calendar) => calendar.addresses)
    @JoinColumn({ name: 'calendarId' })
    	calendar!: CalendarEntity;

    @Column()
    	calendarId!: string;

    @OneToOne(() => PackageEntity, (packag) => packag.address)
    	package!: PackageEntity;
}
