import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

import { OrderItemEntity } from './OrderItem';

@Entity({
	name: 'order'
})
export class OrderEntity {
    @PrimaryGeneratedColumn()
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
}
