import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class CalendarCreated extends IntegrationMessage {
	public CalendarioId: string;
	public PacienteId: string;
	public PlanAlimenticioId: string;

	constructor(CalendarioId: string, PacienteId: string, PlanAlimenticioId: string) {
		super();
		this.CalendarioId = CalendarioId;
		this.PacienteId = PacienteId;
		this.PlanAlimenticioId = PlanAlimenticioId;
	}
}
