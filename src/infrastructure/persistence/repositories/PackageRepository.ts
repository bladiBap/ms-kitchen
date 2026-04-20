import { IPackageRepository } from '@domain/Package/Repositories/IPackageRepository';
import { Package } from '../PersistenceModel/Entities/Package';
import { Package as DomainPackage } from '@domain/Package/Entities/Package';
import { PackageMapper } from '../DomainModel/Config/PackageMapper';

import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

@injectable()
export class PackageRepository implements IPackageRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async getDetailsByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
		console.log(`Fetching package details with id: ${id} (readOnly: ${readOnly})`);
		throw new Error('Method not implemented.');
	}

	async getByIdAsync(id: number, readOnly?: boolean): Promise<DomainPackage | null> {
		console.log(`Fetching package with id: ${id} (readOnly: ${readOnly})`);
		throw new Error('Method not implemented.');
	}

	async addAsync(packageDomain: DomainPackage): Promise<void> {
		const manager = this.emProvider.getManager();
		const packageEntity = PackageMapper.toPersistence(packageDomain);
		await manager.getRepository(Package).save(packageEntity);
	}

	async getPackageByAddressClientIdAsync(addressId: number, clientId: number): Promise<DomainPackage | null> {
		const manager = this.emProvider.getManager();
		const datePk = new Date();
		datePk.setHours(0, 0, 0, 0);
		const packageD = await manager.getRepository(Package).findOne({
			where: {
				address: { id: addressId },
				client: { id: clientId },
				//datePackage: datePk
			}
		});
		if (!packageD) {return null;}
		return PackageMapper.toDomain(packageD);
	}
}
