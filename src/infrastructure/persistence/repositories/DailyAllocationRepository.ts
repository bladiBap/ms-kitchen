import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { DateUtils } from '@shared/utils/Date';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { DailyAllocation } from '@domain/daily-allocation/entities/DailyAllocation';
import { AllocationLine } from '@domain/daily-allocation/entities/AllocationLine';
import { IDailyAllocationRepository } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

import { AllocationLineMapper } from '@infrastructure/persistence/mappers/AllocationLineMapper';
import { DailyAllocationMapper } from '@infrastructure/persistence/mappers/DailyAllocationMapper';
import { DailyAllocationEntity } from '@infrastructure/persistence/entities/DailyAllocationEntity';
import { AllocationLineEntity } from '@infrastructure/persistence/entities/AllocationLineEntity';

@injectable()
export class DailyAllocationRepository implements IDailyAllocationRepository {
	constructor(
		@inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider,
	) {}

	async update(entity: DailyAllocation): Promise<DailyAllocation> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(DailyAllocationEntity);
		const persistenceEntity = DailyAllocationMapper.toPersistence(entity);
		const saved = await repository.save(persistenceEntity);
		return DailyAllocationMapper.toDomain(saved);
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(DailyAllocationEntity);
		const existing = await repository.findOne({ where: { id } });
		if (!existing) {
			return;
		}
		await repository.remove(existing);
	}
	async getAll(): Promise<DailyAllocation[]> {
		const manager = this.emProvider.getManager();
		const repository = manager.getRepository(DailyAllocationEntity);
		const [entities] = await repository.findAndCount({
			relations: ['lines'],
		});
		return entities.map(DailyAllocationMapper.toDomain);
	}

	async getByDate(date: Date): Promise<DailyAllocation | null> {
		const formattedDate = DateUtils.formatDate(date);
		const manager = this.emProvider.getManager();
		const dailyAllocationEntity = await manager.getRepository(DailyAllocationEntity).findOne({
			where: {
				date: formattedDate,
			},
			relations: ['lines'],
		});

		if (!dailyAllocationEntity) {
			return null;
		}
		return DailyAllocationMapper.toDomain(dailyAllocationEntity);
	}
	async getById(id: string): Promise<DailyAllocation | null> {
		console.log(`Fetching daily allocation with id: ${id}`);
		throw new Error('Method not implemented.');
	}

	async create(entity: DailyAllocation): Promise<DailyAllocation> {
		const manager = this.emProvider.getManager();
		const persistenceEntity = DailyAllocationMapper.toPersistence(entity);
		await manager.getRepository(DailyAllocationEntity).save(persistenceEntity);
		return DailyAllocationMapper.toDomain(persistenceEntity);
	}

	async getDailyAllocation(clientId: string, date: Date): Promise<DailyAllocation | null> {
		const manager = this.emProvider.getManager();
		const dailyAllocationEntity = await manager.getRepository(DailyAllocationEntity).findOne({
			where: {
				date: date,
				lines: {
					clientId: clientId
				}
			},
			relations: ['lines'],
		});

		if (!dailyAllocationEntity) {
			return null;
		}
		return DailyAllocationMapper.toDomain(dailyAllocationEntity);
	}

	async updatedLines(lines: AllocationLine[]): Promise<void> {
		const allocationLineEntities = lines.map(line => AllocationLineMapper.toPersistence(line));
		const manager = this.emProvider.getManager();
		await manager.getRepository(AllocationLineEntity).save(allocationLineEntities);
		return;
	}

	async getClientsIdsByDate(date: Date): Promise<string[]> {
		const manager = this.emProvider.getManager();
		const result = await manager.query(`
			SELECT DISTINCT l."clientId"
			FROM "daily_allocation" da
			INNER JOIN "allocation_line" l ON l."allocationId" = da."id"
			WHERE da."date"::date = $1;
		`, [date]);

		return result.map((row: { clientId: string }) => row.clientId);
	}
}
