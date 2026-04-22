export class OutboxMessage<E> {
	public content: E;
	public id: string;
	public type: string;
	public created: Date;
	public processed: boolean;
	public processedOn?: Date | null;
	public correlationId?: string | null;
	public traceId?: string | null;
	public spanId?: string | null;

	constructor(
		content: E, 
		correlationId: string | null = null, 
		traceId: string | null = null, 
		spanId: string | null = null
	) {
		this.id = crypto.randomUUID();
		this.created = new Date();
		this.processed = false;
		this.content = content;
        
		this.type = (content as any).constructor.name;
        
		this.correlationId = correlationId;
		this.traceId = traceId;
		this.spanId = spanId;
	}

	public markAsProcessed(): void {
		this.processedOn = new Date();
		this.processed = true;
	}

	public markAsFailed(): void {
		this.processedOn = new Date();
		this.processed = false;
	}
}