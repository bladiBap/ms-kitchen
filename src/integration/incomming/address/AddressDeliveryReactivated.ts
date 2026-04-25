import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class AddressDeliveryReactivated extends IntegrationMessage {
	public CalendarioId: string;
	public DireccionId: string;

	constructor(calendarioId: string, direccionId: string) {
		super();
		this.CalendarioId = calendarioId;
		this.DireccionId = direccionId;
	}
}