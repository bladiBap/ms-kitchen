import { Package } from '@domain/package/entities/Package';
import { IRepository } from '@core/interfaces/IRepository';

export const IPackageRepositoryToken = Symbol.for('IPackageRepository');

export interface IPackageRepository extends IRepository<Package> {
    getPackageByAddressClientId(addressId: string, clientId: string): Promise<Package | null>;
	isCompleteAllPackagesByOrderId(orderId: string): Promise<boolean>;
}
