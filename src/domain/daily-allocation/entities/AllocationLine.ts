import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@core/abstraction/Entity';
import { DomainException } from '@core/results/DomainException';
import { AllocationLineError } from '@domain/daily-allocation/errors/AllocationLineError';

export class AllocationLine extends Entity {

	private dailyAllocationId : string;
	private clientId : string;
	private recipeId : string;
	private quantityNeeded : number;
	private quantityPackaged : number;

	constructor( id: string, dailyAllocationId: string, clientId: string, recipeId: string,  quantityNeeded: number, quantityPackaged: number = 0) {
		super(id);
		this.dailyAllocationId = dailyAllocationId;
		this.clientId = clientId;
		this.recipeId = recipeId;
		if (quantityNeeded <= 0) {
			throw new DomainException(AllocationLineError.quantityNeededMustBeGreaterThanZero(quantityNeeded));
		}

		if (quantityPackaged > quantityNeeded) {
			throw new DomainException(AllocationLineError.quantityPackagedExceedsNeeded(quantityPackaged, quantityNeeded));
		}
		this.quantityNeeded = quantityNeeded;
		this.quantityPackaged = quantityPackaged;
	}

	public static createNew(dailyAllocationId: string, clientId: string, recipeId: string, quantityNeeded: number) : AllocationLine {
		return new AllocationLine(uuidv4(), dailyAllocationId, clientId, recipeId, quantityNeeded);
	}

	public updateQuantityPackaged(newQuantityPackaged: number) : void {
		if (newQuantityPackaged > this.quantityNeeded) {
			throw new DomainException(AllocationLineError.quantityPackagedExceedsNeeded(newQuantityPackaged, this.quantityNeeded));
		}
		this.quantityPackaged = newQuantityPackaged;
	}

	public remainingQuantityToPackage() : number {
		return this.quantityNeeded - this.quantityPackaged;
	}

	public getClientId() : string {
		return this.clientId;
	}

	public getRecipeId() : string {
		return this.recipeId;
	}

	public getQuantityNeeded() : number {
		return this.quantityNeeded;
	}

	public getQuantityPackaged() : number {
		return this.quantityPackaged;
	}

	public getDailyAllocationId() : string {
		return this.dailyAllocationId;
	}
}
