import { v4 as uuidv4 } from 'uuid';

import { OrderItem } from '@domain/order/entities/OrderItem';
import { OrderError } from '@domain/order/errors/OrderError';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

import { AggregateRoot } from '@core/abstraction/AgregateRoot';
import { DomainException } from '@core/results/DomainException';

export class Order extends AggregateRoot {

	private dateOrdered : Date;
	private dateCreatedOn : Date;
	private status : StatusOrder;
	private listOrderItems : OrderItem[];

	constructor( id: string, dateOrdered: Date, dateCreatedOn: Date, status: StatusOrder, listOrderItems: OrderItem[] = []) {
		super(id);
		this.dateOrdered = dateOrdered;
		this.dateCreatedOn = dateCreatedOn;
		this.status = status;
		this.listOrderItems = listOrderItems;
	}

	public static createNew(dateOrdered: Date, dateCreatedOn: Date, status: StatusOrder, listOrderItems: OrderItem[] = []): Order {
		return new Order(uuidv4(), dateOrdered, dateCreatedOn, status, listOrderItems);
	}

	public changeToCompleted() {
		if (this.status === StatusOrder.COMPLETED){
			throw new DomainException( OrderError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
		}

		if (!this.verifyIfAllItemsCompleted()) {
			throw new DomainException( OrderError.orderItemsNotCompleted(this.id) );
		}
		this.status = StatusOrder.COMPLETED;
	}

	public addItem(recipeId: string, quantityPlanned: number, quantityPrepared: number, quantityDelivered: number, status: StatusOrder) : void {
		const newItem = new OrderItem(uuidv4(), this.id, quantityPlanned, quantityPrepared, quantityDelivered, recipeId, status);
		this.listOrderItems.push(newItem);
	}

	private verifyIfAllItemsCompleted (): boolean {
		return this.listOrderItems.every(item => item.getStatus() === StatusOrder.COMPLETED);
	}

	public isStatusCompleted (): boolean{
		return this.status === StatusOrder.COMPLETED;
	}

	public getIdOrder(): string {
		return this.id;
	}

	public getDateOrdered(): Date {
		return this.dateOrdered;
	}

	public getDateCreatedOn(): Date {
		return this.dateCreatedOn;
	}

	public getStatus(): StatusOrder {
		return this.status;
	}

	public getListOrderItems(): ReadonlyArray<OrderItem> {
		return this.listOrderItems;
	}
}
