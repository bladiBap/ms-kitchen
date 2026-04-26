import { container } from 'tsyringe';
import client, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';
import { RoutingHandlers } from './RoutingHandlers';

export class RabbitMQConsumer {

	private _settings: RabbitMQSettings;
	private _connection!: ChannelModel;
	private _channel!: Channel;

	constructor(
		settings: RabbitMQSettings,
	) {
		this._settings = settings;
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async start(): Promise<void> {
		const RECONNECT_INTERVAL = 5000;
		let connected = false;

		console.log('Iniciando consumidor de RabbitMQ...');
		console.log('Settings:', JSON.stringify(this._settings));

		while (!connected) {
			try {
				this._connection = await client.connect({
					hostname: this._settings.host,
					port: this._settings.port,
					username: this._settings.username,
					password: this._settings.password,
					vhost: this._settings.virtualHost
				});

				this._connection.on('error', (err) => {
					console.error('Error en conexión RabbitMQ:', err.message);
				});

				this._channel = await this._connection.createChannel();
				await this._channel.prefetch(1);

				console.log('Conectado a RabbitMQ exitosamente');
				connected = true;

			} catch (error) {
				console.error('Error al conectar a RabbitMQ:', error);
				console.error(`Error al conectar a RabbitMQ. Reintentando en ${RECONNECT_INTERVAL / 1000}s...`);
				await this.delay(RECONNECT_INTERVAL);
			}
		}
	}

	async consume(): Promise<void> {
		if (!this._channel) {
			console.error('El canal de RabbitMQ no está inicializado');
			return;
		}

		await this._channel.consume('', async (msg: ConsumeMessage | null) => {
			if (!msg) {
				return;
			}
			const routingKey = msg.fields.routingKey;
			try {
				const handlerTarget = RoutingHandlers[routingKey];

				const content = this.deserializeMessage(msg.content);

				if (content) {
					if (!handlerTarget) {
						console.warn(`No se encontró un handler para el routing key: ${routingKey}`);
						this._channel.nack(msg, false, false);
						return;
					}
					const handlerInstance = container.resolve<IIntegrationMessageConsumer<any>>(handlerTarget);
					await handlerInstance.handle(content);

					this._channel.ack(msg);
				}
			} catch (error: unknown) {
				console.error('Error procesando mensaje', error);
				this._channel.nack(msg, false, true);
			}
		}, { noAck: false });
	}

	async stop(): Promise<void> {
		if (this._channel) {
			await this._channel.close();
		}
		if (this._connection) {
			await this._connection.close();
		}
	}

	private deserializeMessage(body: Buffer): any | null {
		try {
			const json = body.toString('utf-8');
			return JSON.parse(json);
		} catch (error) {
			console.error('Error al deserializar mensaje:', error);
			return null;
		}
	}
}
