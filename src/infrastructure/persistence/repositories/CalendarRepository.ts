import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Calendar } from '@domain/calendar/entities/Calendar';
import { ICalendarRepository } from '@domain/calendar/repositories/ICalendarRepository';
import { CalendarEntity } from '@infrastructure/persistence/entities/CalendarEntity';
import { CalendarMapper } from '@infrastructure/persistence/mappers/CalendarMapper';

@injectable()
export class CalendarRepository implements ICalendarRepository {
	constructor(
		@inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(entity: Calendar): Promise<Calendar> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(CalendarEntity);
		const saved = await repo.save(CalendarMapper.toPersistence(entity));
		return CalendarMapper.toDomain(saved);
	}

	async getById(id: string): Promise<Calendar | null> {
		const manager = this.emProvider.getManager();
		const entity = await manager.getRepository(CalendarEntity).findOne({
			where: { id },
			relations: ['client', 'mealPlan'],
		});

		if (!entity) {
			return null;
		}

		return CalendarMapper.toDomain(entity);
	}

	async update(entity: Calendar): Promise<Calendar> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(CalendarEntity);
		const updated = await repo.save(CalendarMapper.toPersistence(entity));
		return CalendarMapper.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(CalendarEntity).delete({ id });
	}

	async getAll(): Promise<Calendar[]> {
		const manager = this.emProvider.getManager();
		const rows = await manager.getRepository(CalendarEntity).find({
			relations: ['client', 'mealPlan'],
		});

		return rows.map((row) => CalendarMapper.toDomain(row));
	}
}
