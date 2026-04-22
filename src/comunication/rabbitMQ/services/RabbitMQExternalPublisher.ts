import { inject, injectable } from 'tsyringe';
import client, { Channel, ChannelModel } from 'amqplib';

import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';
import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';
import { IExternalPublisher } from '@comunication/contracts/services/IExternalPublisher';

@injectable()
export class RabbitMQExternalPublisher implements IExternalPublisher {

	constructor(
        @inject(RabbitMQSettings) private readonly settings: RabbitMQSettings
	) {}

	async publishAsync<T extends IntegrationMessage>(
		message: T,
		destination?: string | null,
		routingKey?: string | null,
		declareDestination?: boolean
	): Promise<void> {
		console.log(`Publicando mensaje de tipo ${message.constructor.name} en RabbitMQ...`);
		console.log(`Configuración de RabbitMQ: Host=${this.settings.host}, Port=${this.settings.port}, VirtualHost=${this.settings.virtualHost}`);
		console.log(`Settings: ${JSON.stringify(this.settings)}`);
		const connection : ChannelModel = await client.connect({
			hostname: this.settings.host,
			port: this.settings.port,
			username: this.settings.username,
			password: this.settings.password,
			vhost: this.settings.virtualHost
		});

		const channel: Channel = await connection.createChannel();

		try {

			const typeName = message.constructor.name;
			const exchangeName = destination ?? this.pasalToKebabCase(typeName);

			if (declareDestination) {
				console.log(`Declarando exchange: ${exchangeName}`);
				await channel.assertExchange(exchangeName, 'fanout', { durable: true });
			}

			const messageBuffer = Buffer.from(JSON.stringify(message));

			console.log(`Publicando mensaje de tipo ${typeName} en exchange: ${exchangeName}`);

			const published = channel.publish(
				exchangeName,
				routingKey ?? '',
				messageBuffer,
				{
					contentType: 'application/json',
					persistent: true,
					// headers: {
					//     'x-type-name': typeName
					// }
				}
			);

			if (!published) {
				throw new Error('El mensaje no pudo ser publicado en el buffer de RabbitMQ');
			}

		} catch (error) {
			console.error(`Error publicando en RabbitMQ (${destination}):`, error);
			throw error;
		} finally {
			await channel.close();
			await connection.close();
		}
	}

	private pasalToKebabCase(value: string): string {
		if (!value) {
			return value;
		}
		return value
			.replace(/(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z0-9])/g, '-$1')
			.toLowerCase();
	}
}
