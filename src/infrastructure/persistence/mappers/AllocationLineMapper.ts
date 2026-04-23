import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { AllocationLineEntity } from '@infrastructure/persistence/entities/AllocationLineEntity';

export class AllocationLineMapper  {

	static toPersistence(allocationLine: AllocationLine): AllocationLineEntity {
		const lineEntity = new AllocationLineEntity();

		lineEntity.id = allocationLine.getId();
		lineEntity.allocationId = allocationLine.getDailyAllocationId();
		lineEntity.clientId = allocationLine.getClientId();
		lineEntity.recipeId = allocationLine.getRecipeId();
		lineEntity.quantityNeeded = allocationLine.getQuantityNeeded();
		lineEntity.quantityPackaged = allocationLine.getQuantityPackaged();
		return lineEntity;
	}

	static toDomain(data: AllocationLineEntity): AllocationLine {
		const allocationLine = new AllocationLine(
			data.id,
			data.allocationId,
			data.clientId,
			data.recipeId,
			data.quantityNeeded,
			data.quantityPackaged
		);
		return allocationLine;
	}
}
