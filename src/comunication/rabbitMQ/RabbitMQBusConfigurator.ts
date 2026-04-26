import { container } from 'tsyringe';

import { RabbitMQConsumer } from '@comunication/rabbitMQ/services/RabbitMQConsumer';
import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';

export class RabbitMQBusConfigurator {
	private static consumer : RabbitMQConsumer;
	/**
     * Registra un consumidor para una cola específica
     * @param messageName Identificador único del mensaje (ej: 'ProductCreated')
     * @param handlerClass La clase que procesará el mensaje
     * @param queueName Nombre de la cola en RabbitMQ
     */
	public static addConsumers() {
		const settings = container.resolve(RabbitMQSettings);
		const consumer = new RabbitMQConsumer(settings);
		this.consumer = consumer;
	}

	public static async start(): Promise<void> {
		await this.consumer.start();
		await this.consumer.consume();
	}
}
