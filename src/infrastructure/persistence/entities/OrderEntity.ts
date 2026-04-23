import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

import { OrderItemEntity } from './OrderItemEntity';
import { PackageEntity } from './PackageEntity';

@Entity({
	name: 'order'
})
export class OrderEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column({ type: 'date' })
    	dateOrdered!: Date;

    @Column({ type: 'date' })
    	dateCreatedOn!: Date;

    @Column({
    	type: 'enum',
    	enum: StatusOrder,
    	default: StatusOrder.CREATED
    })
    	status!: StatusOrder;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, { cascade: true, eager: true })
    	orderItems!: OrderItemEntity[];

	@OneToMany(() => PackageEntity, (packageEntity) => packageEntity.order)
	packages!: PackageEntity[];
}
