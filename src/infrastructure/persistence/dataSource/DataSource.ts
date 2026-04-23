import 'dotenv/config';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '@shared/constants/env';


export const AppDataSourceToken = Symbol('AppDataSource');

const options: DataSourceOptions = {
	type: 'postgres',
	host: env.MS_KITCHEN_DB_HOST,
	port: env.MS_KITCHEN_DB_PORT,
	username: env.MS_KITCHEN_DB_USER,
	password: env.MS_KITCHEN_DB_PASSWORD,
	database: env.MS_KITCHEN_DB_NAME,
	// synchronize: env.APP_NODE_ENV === env.NODE_ENVS.DEVELOPMENT,
	logging: false,
	entities: [path.join(__dirname, '../entities/**/*.{ts,js}'), path.join(__dirname, '../../../outbox/persistence/**/*.{ts,js}')],
	migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
	subscribers: []
};

export const AppDataSource = new DataSource(options);
