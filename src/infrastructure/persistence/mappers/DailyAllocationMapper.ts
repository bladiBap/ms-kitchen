import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { DailyAllocationEntity } from '@infrastructure/persistence/entities/DailyAllocationEntity';

import { AllocationLine} from '@domain/daily-allocation/entities/AllocationLine';
import { AllocationLineEntity } from '@infrastructure/persistence/entities/AllocationLineEntity';

export class DailyAllocationMapper  {

	static toPersistence(dailyAllocation: DailyAllocation): DailyAllocationEntity {
		const addressEntity = new DailyAllocationEntity();
		addressEntity.id = dailyAllocation.getId();
		addressEntity.date = dailyAllocation.getDate();
		addressEntity.lines = dailyAllocation.getLines().map((line: AllocationLine) => {
			const lineEntity = new AllocationLineEntity();
			lineEntity.id = line.getId();
			lineEntity.allocationId = dailyAllocation.getId();
			lineEntity.clientId = line.getClientId();
			lineEntity.recipeId = line.getRecipeId();
			lineEntity.quantityNeeded = line.getQuantityNeeded();
			lineEntity.quantityPackaged = line.getQuantityPackaged();
			return lineEntity;
		});

		addressEntity.lines.forEach(line => {
			line.allocation = addressEntity;
		});
		return addressEntity;
	}

	static toDomain(data: DailyAllocationEntity): DailyAllocation {
		const lines = data.lines.map((lineEntity: AllocationLineEntity) => {
			return new AllocationLine(
				lineEntity.id,
				lineEntity.allocationId,
				lineEntity.clientId,
				lineEntity.recipeId,
				lineEntity.quantityNeeded,
				lineEntity.quantityPackaged
			);
		});

		return new DailyAllocation(
			data.id,
			data.date,
			lines
		);
	}
}
