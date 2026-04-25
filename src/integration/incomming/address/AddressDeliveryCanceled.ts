import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class AddressDeliveryCanceled extends IntegrationMessage {
	public CalendarioId: string;
	public DireccionId: string;

	constructor(calendarioId: string, direccionId: string) {
		super();
		this.CalendarioId = calendarioId;
		this.DireccionId = direccionId;
	}
}