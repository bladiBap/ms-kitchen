import { singleton } from 'tsyringe';
import { env } from '@shared/constants/env';

@singleton()
export class RabbitMQSettings {
	constructor(
        public readonly port: number = 5672,
        public readonly useSSL: boolean = false,
        public readonly host: string = env.RABBITMQ_HOST,
        public readonly username: string = env.RABBITMQ_USERNAME,
        public readonly password: string = env.RABBITMQ_PASSWORD,
        public readonly virtualHost: string = env.RABBITMQ_VIRTUAL_HOST
	) {}
}
