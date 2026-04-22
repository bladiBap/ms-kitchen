import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import '@infrastructure/DependencyInjection';
import '@application/DependencyInjection';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { container } from 'tsyringe';

import { env } from '@shared/constants/env';
import { mainRouter } from '@api/routes';
import { AppDataSource, AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

async function startServer() {
	const DataSource = await AppDataSource.initialize();
	container.register(AppDataSourceToken, { useValue: DataSource });

	const app = express();

	app.use(cors());
	app.use(morgan('dev'));
	app.use(express.json());

	app.use('/api/kitchen', mainRouter);

	app.listen(env.APP_PORT, () => {
		console.log(`Server is running on port ${env.APP_PORT}`);
	});
}

startServer().catch((error) => {
	console.error('Error starting server:', error);
	process.exit(1);
});
