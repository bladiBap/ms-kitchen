import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class PackageAllCompletedIntegration extends IntegrationMessage {
	orderId : string;
	lastPackageCompletedId : string;

	constructor(orderId: string, lastPackageCompletedId: string) {
		super();
		this.orderId = orderId;
		this.lastPackageCompletedId = lastPackageCompletedId;
	}
}
