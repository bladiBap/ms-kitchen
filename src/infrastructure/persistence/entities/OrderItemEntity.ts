import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

import { OrderEntity } from './OrderEntity';
import { RecipeEntity } from './RecipeEntity';

@Entity({
	name: 'order_item'
})
export class OrderItemEntity {
	@PrimaryColumn('uuid')
    	id!: string;

    @Column({
    	type: 'enum',
    	enum: StatusOrder,
    	default: StatusOrder.CREATED
    })
    	status!: StatusOrder;

    @Column({
    	type: 'int'
    })
    	quantityPlanned!: number;

    @Column({
    	type: 'int',
    	default: 0
    })
    	quantityPrepared!: number;

    @Column({
    	type: 'int',
    	default: 0
    })
    	quantityDelivered!: number;

    @ManyToOne(() => RecipeEntity, (recipe) => recipe.orderItems)
    @JoinColumn({ name: 'recipeId' })
    	recipe!: RecipeEntity;

    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    @JoinColumn({ name: 'orderId' })
    	order!: OrderEntity;

    @Column()
    	recipeId!: string;

    @Column()
    	orderId!: string;
}
