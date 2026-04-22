export abstract class IntegrationMessage {
	public id: string;
	public createdAt: Date;
	public correlationId?: string | null;
	public source?: string | null;

	constructor(correlationId?: string | null, source?: string | null) {
		this.id = crypto.randomUUID(); 
		this.createdAt = new Date();
        
		this.correlationId = correlationId;
		this.source = source;
	}
}