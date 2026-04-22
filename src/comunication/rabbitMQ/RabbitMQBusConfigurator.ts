import { InjectionToken, container } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';

import { RabbitMQConsumer } from '@comunication/rabbitMQ/services/RabbitMQConsumer';
import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';

export class RabbitMQBusConfigurator {
	private static _consumers: RabbitMQConsumer<any>[] = [];
	/**
     * Registra un consumidor para una cola específica
     * @param messageName Identificador único del mensaje (ej: 'ProductCreated')
     * @param handlerClass La clase que procesará el mensaje
     * @param queueName Nombre de la cola en RabbitMQ
     */
	public static addConsumer<T extends IntegrationMessage>(
		messageName: string,
		handlerClass: constructor<IIntegrationMessageConsumer<T>>,
		queueName: string,
		exchangeName: string,
		routingKey: string
	): typeof RabbitMQBusConfigurator {

		const handlerToken: InjectionToken = `Handler_${messageName}`;

		container.register(handlerToken, { useClass: handlerClass });
		const settings = container.resolve(RabbitMQSettings);

		const consumer = new RabbitMQConsumer<T>(
			queueName,
			settings,
			false,
			exchangeName,
			routingKey,
			handlerToken
		);

		this._consumers.push(consumer);
		return this;
	}

	public static async start(): Promise<void> {
		for (const consumer of this._consumers) {
			await consumer.start();
			await consumer.consume();
			console.log('[Bus] Consumidor iniciado para una cola.');
		}
	}
}
