import { PackageItem } from '@domain/package/entities/PackageItem';
import { PackageItemEntity } from '@infrastructure/persistence/entities/PackageItemEntity';

export class PackageItemMapper {
	static toPersistenceList(items: PackageItem[]): PackageItemEntity[] {
		return items.map(item => this.toPersistence(item));
	}

	static toPersistence(item: PackageItem): PackageItemEntity {
		const itemEntity = new PackageItemEntity();
		itemEntity.id = item.getId();
		itemEntity.recipeId = item.getRecipeId();
		itemEntity.packageId = item.getPackageId();
		itemEntity.quantity = item.getQuantity();
		return itemEntity;
	}

	static toDomainList(data: PackageItemEntity[]): PackageItem[] {
		return data.map(item => this.toDomain(item));
	}

	static toDomain(data: PackageItemEntity): PackageItem {
		return new PackageItem(
			data.id,
			data.recipeId,
			data.packageId,
			data.quantity
		);
	}
}
