import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { StatusPackage } from '@domain/package/types/StatusPackage';

import { PackageItemEntity } from './PackageItem';
import { ClientEntity } from './Client';
import { AddressEntity } from './Address';

@Entity({
	name: 'package'
})
export class PackageEntity {
    @PrimaryGeneratedColumn()
    	id!: string;

    @Column()
    	code!: string;

    @Column({ type: 'date' })
    	datePackage!: Date;

    @Column({ type: 'enum', enum: StatusPackage, default: StatusPackage.PACKAGING })
    	status!: StatusPackage;

    @OneToMany(() => PackageItemEntity, (packageItem) => packageItem.package, { cascade: true, eager: true })
    	packageItems!: PackageItemEntity[];

    @ManyToOne(() => ClientEntity, (client) => client.packages)
    @JoinColumn({ name: 'clientId' })
    	client!: ClientEntity;

    @OneToOne(() => AddressEntity, (address) => address.package, { cascade: true, eager: true })
    @JoinColumn({ name: 'addressId' })
    	address!: AddressEntity;

    @Column()
    	clientId!: string;

    @Column()
    	addressId!: string;
}
