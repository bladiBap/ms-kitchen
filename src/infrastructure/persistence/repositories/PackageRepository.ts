import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Package } from '@domain/package/entities/Package';
import { IPackageRepository } from '@domain/package/repositories/IPackageRepository';

import { PackageMapper } from '@infrastructure/persistence/mappers/PackageMapper';
import { PackageEntity } from '@infrastructure/persistence/entities/Package';

@injectable()
export class PackageRepository implements IPackageRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}
	async create(entity: Package): Promise<Package> {
		const manager = this.emProvider.getManager();
		const packageEntity = PackageMapper.toPersistence(entity);
		const saved = await manager.getRepository(PackageEntity).save(packageEntity);
		return PackageMapper.toDomain(saved);
	}

	async getById(id: string): Promise<Package | null> {
		const manager = this.emProvider.getManager();
		const packageEntity = await manager.getRepository(PackageEntity).findOne({
			where: { id },
		});

		return packageEntity ? PackageMapper.toDomain(packageEntity) : null;
	}

	async update(entity: Package): Promise<Package> {
		const manager = this.emProvider.getManager();
		const packageEntity = PackageMapper.toPersistence(entity);
		const saved = await manager.getRepository(PackageEntity).save(packageEntity);
		return PackageMapper.toDomain(saved);
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(PackageEntity).delete(id);
	}

	async getAll(): Promise<Package[]> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(PackageEntity);
		const packages = await repository.find();
		return packages.map((packageEntity) => PackageMapper.toDomain(packageEntity));
	}

	async getPackageByAddressClientId(addressId: string, clientId: string): Promise<Package | null> {
		const manager = this.emProvider.getManager();
		const packageD = await manager.getRepository(PackageEntity).findOne({
			where: {
				address: { id: addressId },
				client: { id: clientId }
			}
		});
		if (!packageD) {return null;}
		return PackageMapper.toDomain(packageD);
	}
}
