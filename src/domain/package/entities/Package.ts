import { v4 as uuidv4 } from 'uuid';
import { DomainException } from '@core/results/DomainException';
import { AggregateRoot } from '@core/abstraction/AgregateRoot';

import { StatusPackage } from '@domain/package/types/StatusPackage';
import { PackageError } from '@domain/package/errors/PackageError';
import { PackageItem } from '@domain/package/entities/PackageItem';
import { PackageCompletedEvent } from '@domain/package/events/PackageCompletedEvent';

export class Package extends AggregateRoot {
	private orderId: string;
	private clientId: string;
	private addressId: string;
	private code: string;
	private statusPackage: StatusPackage;
	private datePackage: Date = new Date();
	private listPackageItems: PackageItem[] = [];

	constructor(id: string, orderId: string, code: string, statusPackage: StatusPackage, clientId: string, addressId: string, datePackage: Date, listPackageItems: PackageItem[] = []) {
		super(id);

		if (code.trim().length === 0) {
			throw new DomainException( PackageError.codeIsRequired() );
		}

		this.orderId = orderId;
		this.code = code;
		this.statusPackage = statusPackage;
		this.clientId = clientId;
		this.listPackageItems = listPackageItems;
		this.addressId = addressId;
		this.datePackage = datePackage;
	}

	public static createNew(orderId: string, code: string, statusPackage: StatusPackage, clientId: string, addressId: string, datePackage: Date, listPackageItems: PackageItem[] = []): Package {
		return new Package(uuidv4(), orderId, code, statusPackage, clientId, addressId, datePackage, listPackageItems);
	}

	public addPackageItem(packageItem: PackageItem): void {
		if (this.statusPackage === StatusPackage.COMPLETED) {
			throw new DomainException( PackageError.cannotAddItemToDeliveredPackage() );
		}
		this.listPackageItems.push(packageItem);
	}

	public changeToCompleted(): void {
		if (this.statusPackage !== StatusPackage.CREATED) {
			throw new DomainException( PackageError.canNotChangeStatus(this.statusPackage, StatusPackage.COMPLETED) );
		}
		this.statusPackage = StatusPackage.COMPLETED;
		this.addDomainEvent(new PackageCompletedEvent(this.orderId, this.id));
	}

	public getOrderId(): string {
		return this.orderId;
	}

	public getCode(): string {
		return this.code;
	}

	public getStatusPackage(): StatusPackage {
		return this.statusPackage;
	}

	public getClientId(): string {
		return this.clientId;
	}

	public getListPackageItems(): PackageItem[] {
		return this.listPackageItems;
	}

	public getAddressId(): string {
		return this.addressId;
	}

	public getDatePackage(): Date {
		return this.datePackage;
	}
}
