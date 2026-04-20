import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@core/abstraction/Entity';

export class PackageItem extends Entity {

	private recipeId: string;
	private packageId: string;
	private quantity: number;

	constructor(id: string, recipeId: string, packageId: string, quantity: number) {
		super(id);
		this.recipeId = recipeId;
		this.packageId = packageId;
		this.quantity = quantity;
	}

	public static create(recipeId: string, packageId: string, quantity: number): PackageItem {
		return new PackageItem(uuidv4(), recipeId, packageId, quantity);
	}

	public getRecipeId(): string {
		return this.recipeId;
	}

	public getPackageId(): string {
		return this.packageId;
	}

	public getQuantity(): number {
		return this.quantity;
	}
}
