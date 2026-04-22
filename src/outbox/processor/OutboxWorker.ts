import { injectable, DependencyContainer, container } from 'tsyringe';
import { OutboxProcessor } from '@outbox/processor/OutboxProcesor';

@injectable()
export class OutboxWorker {
	private intervalId: NodeJS.Timeout | null = null;
	private readonly INTERVAL_MS = 12000;
	private isProcessing = false;

	constructor(
	) {}

	public start(): void {
		if (this.intervalId) {
			return;
		}

		console.log('Outbox Worker iniciado en Node.js...');

		this.runCycle();
		this.intervalId = setInterval(() => this.runCycle(), this.INTERVAL_MS);
	}

	private async runCycle(): Promise<void> {
		if (this.isProcessing) {
			return;
		}
		this.isProcessing = true;

		const childContainer: DependencyContainer = container.createChildContainer();
		try {
			console.log(`Outbox Worker ejecutando ciclo a las ${new Date().toISOString()}`);
			const processor = childContainer.resolve(OutboxProcessor);
			await processor.process();
			console.log(`Outbox Worker ciclo finalizado a las ${new Date().toISOString()}`);
		} catch (error) {
			console.error('Error fatal en el ciclo del worker:', error);
		} finally {
			this.isProcessing = false;
		}
	}
}
