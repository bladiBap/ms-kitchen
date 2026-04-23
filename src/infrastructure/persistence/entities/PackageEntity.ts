import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { StatusPackage } from '@domain/package/types/StatusPackage';

import { PackageItemEntity } from './PackageItemEntity';
import { ClientEntity } from './ClientEntity';
import { AddressEntity } from './AddressEntity';
import { OrderEntity } from './OrderEntity';

@Entity({
	name: 'package'
})
export class PackageEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	code!: string;

    @Column({ type: 'date' })
    	datePackage!: Date;

    @Column({ type: 'enum', enum: StatusPackage, default: StatusPackage.CREATED })
    	status!: StatusPackage;

    @OneToMany(() => PackageItemEntity, (packageItem) => packageItem.package, { cascade: true, eager: true })
    	packageItems!: PackageItemEntity[];

    @ManyToOne(() => ClientEntity, (client) => client.packages)
    @JoinColumn({ name: 'clientId' })
    	client!: ClientEntity;

    @OneToOne(() => AddressEntity, (address) => address.package, { cascade: true, eager: true })
    @JoinColumn({ name: 'addressId' })
    	address!: AddressEntity;

	@ManyToOne(() => OrderEntity, (order) => order.packages)
	@JoinColumn({ name: 'orderId' })
	order!: OrderEntity;

	@Column()
	orderId!: string;

    @Column()
    	clientId!: string;

    @Column()
    	addressId!: string;
}
