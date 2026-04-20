import { v4 as uuidv4 } from 'uuid';
import { OrderItemError } from '@domain/order/errors/OrderItemError';
import { StatusOrder } from '@domain/order/types/StatusOrderEnum';

import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';
import { OrderItemCompletedEvent } from '@domain/order/events/OrderItemCompletedEvent';

export class OrderItem extends Entity{

	private orderId : string;
	private recipeId : string;
	private quantityPlanned : number;
	private quantityPrepared : number;
	private quantityDelivered : number;
	private status : StatusOrder;

	constructor(
		id: string,
		orderId: string,
		quantityPlanned: number,
		quantityPrepared: number,
		quantityDelivered: number,
		recipeId: string,
		status: StatusOrder
	) {
		super(id);
		if (quantityPlanned <= 0) {
			throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(quantityPlanned) );
		}
		this.quantityPlanned = quantityPlanned;
		this.quantityPrepared = quantityPrepared;
		this.quantityDelivered = quantityDelivered;
		this.recipeId = recipeId;
		this.status = status;
		this.orderId = orderId;
	}

	public static create(orderId: string, quantityPlanned: number, recipeId: string) : OrderItem {
		return new OrderItem(uuidv4(), orderId, quantityPlanned, 0, 0, recipeId, StatusOrder.CREATED);
	}

	private changeStatusToCompleted() : void {
		if (this.status === StatusOrder.COMPLETED) {
			throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
		}

		if (this.status !== StatusOrder.CREATED) {
			throw new DomainException( OrderItemError.canNotChangeStatus(this.status, StatusOrder.COMPLETED) );
		}

		this.status = StatusOrder.COMPLETED;
		this.addDomainEvent(new OrderItemCompletedEvent(this.orderId));
	}

	public increaseQuantityPrepared(amount: number) : void {

		if (this.quantityPlanned === this.quantityPrepared) {
			return;
		}

		if (amount <= 0) {
			throw new DomainException( OrderItemError.quantityMustBeGreaterThanZero(amount) );
		}

		const newQuantityPrepared = this.quantityPrepared + amount;
		if (newQuantityPrepared > this.quantityPlanned) {
			throw new DomainException( OrderItemError.quantityPreparedExceedsPlanned(newQuantityPrepared, this.quantityPlanned) );
		}

		if (newQuantityPrepared === this.quantityPlanned) {
			this.changeStatusToCompleted()
		};

		this.quantityPrepared = newQuantityPrepared;
	}

	public updateQuantityDelivered(newQuantityDelivered: number) : void {
		if (newQuantityDelivered > this.quantityPrepared) {
			throw new DomainException( OrderItemError.quantityPreparedExceedsPlanned(newQuantityDelivered, this.quantityPrepared) );
		}
		this.quantityDelivered = newQuantityDelivered;
	}

	public remainingQuantityToPrepare() : number {
		return this.quantityPlanned - this.quantityPrepared;
	}

	public remainingQuantityToDeliver() : number {
		return this.quantityPrepared - this.quantityDelivered;
	}

	public isStatusCompleted() : boolean {
		return this.status === StatusOrder.COMPLETED;
	}

	public getRecipeId() : string {
		return this.recipeId;
	}

	public getStatus() : StatusOrder {
		return this.status;
	}

	public getOrderId() : string {
		return this.orderId;
	}

	public getQuantityPrepared() : number {
		return this.quantityPrepared;
	}

	public getQuantityDelivered() : number {
		return this.quantityDelivered;
	}

	public getQuantityPlanned() : number {
		return this.quantityPlanned;
	}
}
