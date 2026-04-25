import { inject, injectable } from 'tsyringe';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';
import { Result } from '@core/results/Result';

import { Transactional } from '@application/common/decorator/Transactional';
import { CreateCalendarCommand } from '@application/calendar/command/CreateCalendarCommand';
import { Calendar } from '@domain/calendar/entities/Calendar';
import { ICalendarRepository, ICalendarRepositoryToken } from '@domain/calendar/repositories/ICalendarRepository';

@injectable()
export class CreateCalendarHandler implements IRequestHandler<CreateCalendarCommand, Result> {
	constructor(
		@inject(ICalendarRepositoryToken) private readonly calendarRepository: ICalendarRepository
	) {}

	@Transactional()
	async handle(createCalendarCommand: CreateCalendarCommand): Promise<Result> {
		const calendar = Calendar.createNew(
			createCalendarCommand.id,
			createCalendarCommand.clientId,
			createCalendarCommand.mealPlanId
		);

		await this.calendarRepository.create(calendar);

		return Result.success();
	}
}