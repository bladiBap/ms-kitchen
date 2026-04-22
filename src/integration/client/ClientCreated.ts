import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class ClientCreated extends IntegrationMessage {
	public PatientId: string;
	public FirstName: string;

	constructor(clientId: string, firstName: string) {
		super();
		this.PatientId = clientId;
		this.FirstName = firstName;
	}
}
