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
import { DiscoveryService } from '@/consul/DiscoveryService';
import { AppDataSource, AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';

async function startServer() {
	const DataSource = await AppDataSource.initialize();
	container.register(AppDataSourceToken, { useValue: DataSource });

	const app = express();
	const discoveryService = container.resolve(DiscoveryService);

	app.use(cors());
	app.use(morgan('dev'));
	app.use(express.json());

	app.use('/api/kitchen', mainRouter);

	app.listen(env.MS_KITCHEN_APP_PORT, async () => {
		console.log(`Server is running on port ${env.MS_KITCHEN_APP_PORT}`);
		// await discoveryService.register();
	});

	process.on('SIGINT', async () => {
		console.log('SIGINT received, deregistering from Consul...');
		await discoveryService.deregister();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		console.log('SIGTERM received, deregistering from Consul...');
		await discoveryService.deregister();
		process.exit(0);
	});

	process.on('uncaughtException', async (err) => {
		console.error('Uncaught Exception:', err);
		await discoveryService.deregister();
		process.exit(1);
	});

	process.on('unhandledRejection', async (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
		await discoveryService.deregister();
		process.exit(1);
	});
}

startServer().catch((error) => {
	console.error('Error starting server:', error);
	process.exit(1);
});
