import { Package } from '@domain/package/entities/Package';
import { PackageEntity } from '@infrastructure/persistence/entities/Package';

import { PackageItem } from '@domain/package/entities/PackageItem';
import { PackageItemEntity } from '@infrastructure/persistence/entities/PackageItem';

import { PackageItemMapper } from './PackageItemMapper';

export class PackageMapper {

	static toPersistenceList(packages: Package[]): PackageEntity[] {
		return packages.map(packaged => this.toPersistence(packaged));
	}

	static toPersistence(packaged: Package): PackageEntity {

		const packageItemsEntities: PackageItemEntity[] = packaged.getListPackageItems()?.map(item => {
			const itemEntity = PackageItemMapper.toPersistence(item);
			return itemEntity;
		}
		);
		const packageEntity = new PackageEntity();
		packageEntity.id = packaged.getId();
		packageEntity.addressId = packaged.getAddressId();
		packageEntity.clientId = packaged.getClientId();
		packageEntity.packageItems = packageItemsEntities || [];
		packageEntity.datePackage = packaged.getDatePackage();
		packageEntity.status = packaged.getStatusPackage();
		packageEntity.code = packaged.getCode();

		return packageEntity;
	}

	static toDomainList(data: PackageEntity[]): Package[] {
		return data.map(packaged => this.toDomain(packaged));
	}

	static toDomain(data: PackageEntity): Package {
		const packageItems: PackageItem[] = data.packageItems?.map(item => {
			return new PackageItem(
				item.id,
				item.recipeId,
				item.packageId,
				item.quantity
			);
		});

		return new Package(
			data.id,
			data.code,
			data.status,
			data.clientId,
			data.addressId,
			data.datePackage,
			packageItems || []
		);
	}
}
