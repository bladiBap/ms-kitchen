import { IRepository } from '@core/interfaces/IRepository';
import { Package } from '../entities/Package';

export interface IPackageRepository extends IRepository<Package> {
    getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<Package | null>;
    getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<Package | null>;
}
