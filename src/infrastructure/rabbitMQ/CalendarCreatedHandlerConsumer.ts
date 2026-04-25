import { inject, injectable } from 'tsyringe';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { CalendarCreated } from '@/integration/incomming/calendar/CalendarCreated';
import { Mediator } from '@shared/mediator/Mediator';
import { CreateCalendarCommand } from '@application/calendar/command/CreateCalendarCommand';

@injectable()
export class CalendarCreatedHandlerConsumer implements IIntegrationMessageConsumer<CalendarCreated> {

	constructor(
		@inject(Mediator) private readonly mediator: Mediator
	){}

	async handle(message: CalendarCreated, cancellationToken?: AbortSignal): Promise<void> {
		console.log(`Received CalendarCreated message for calendar: ${message.CalendarioId}`, cancellationToken);
		const command = new CreateCalendarCommand(
			message.CalendarioId,
			message.PacienteId,
			message.PlanAlimenticioId
		);

		await this.mediator.send(command);
	}
}
