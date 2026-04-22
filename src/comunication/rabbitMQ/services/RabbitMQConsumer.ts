import { InjectionToken, container } from 'tsyringe';
import client, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';
import { IntegrationMessage } from '@comunication/contracts/message/IntegrationMessage';
import { IIntegrationMessageConsumer } from '@comunication/contracts/services/IIntegrationMessageConsumer';

export class RabbitMQConsumer<T extends IntegrationMessage> {

	private _queueName: string;
	private _exchangeName: string;
	private _settings: RabbitMQSettings;
	private _declareQueue: boolean;
	private _connection!: ChannelModel;
	private _channel!: Channel;
	private _routingKey: string;
	private _handlerToken: InjectionToken<IIntegrationMessageConsumer<T>>;

	constructor(
		queueName: string,
		settings: RabbitMQSettings,
		declareQueue: boolean,
		exchangeName: string,
		routingKey: string,
		handlerToken: InjectionToken<IIntegrationMessageConsumer<T>>
	) {
		this._queueName = queueName;
		this._settings = settings;
		this._declareQueue = declareQueue;
		this._exchangeName = exchangeName;
		this._routingKey = routingKey;
		this._handlerToken = handlerToken;
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

		if (this._exchangeName) {
			console.log(`Declarando exchange: ${this._exchangeName}`);
			await this._channel.assertExchange(this._exchangeName, 'topic', { durable: true });
		}

		if (this._declareQueue && this._exchangeName) {
			console.log(`Declarando queue: ${this._queueName}`);
			const queueResult = await this._channel.assertQueue(this._queueName, { durable: true });
			console.log(`Enlazando queue ${this._queueName} al exchange ${this._exchangeName} con routingKey ${this._routingKey}`);
			await this._channel.bindQueue(queueResult.queue, this._exchangeName, this._routingKey);
		}

		console.log(`[*] Esperando mensajes en ${this._queueName}`);

		await this._channel.consume(this._queueName, async (msg: ConsumeMessage | null) => {
			if (!msg) {
				return;
			}

			try {

				const handler = container.resolve(this._handlerToken);

				const content = this.deserializeMessage(msg.content);

				if (content) {
					await handler.handle(content);

					this._channel.ack(msg);
				}
			} catch (error: unknown) {
				console.error(`Error procesando mensaje en ${this._queueName}:`, error);
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

	private deserializeMessage(body: Buffer): T | null {
		try {
			const json = body.toString('utf-8');
			return JSON.parse(json) as T;
		} catch (error) {
			console.error('Error al deserializar mensaje:', error);
			return null;
		}
	}
}
