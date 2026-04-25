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

import { RabbitMQBusConfigurator } from '@comunication/rabbitMQ/RabbitMQBusConfigurator';
import { CalendarCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/CalendarCreatedHandlerConsumer';
import { AddressCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/AddressCreatedHandlerConsumer';
import { AddressUpdatedHandlerConsumer } from '@infrastructure/rabbitMQ/AddressUpdatedHandlerConsumer';
import { ClientCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/ClientCreatedHandlerConsumer';
import { IngredientCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/IngredientCreatedHandlerConsumer';
import { RecipeCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/RecipeCreatedHandlerConsumer';


async function startServer() {
	const DataSource = await AppDataSource.initialize();
	container.register(AppDataSourceToken, { useValue: DataSource });

	const app = express();
	const discoveryService = container.resolve(DiscoveryService);
	// const outboxWorker = container.resolve(OutboxWorker);
	// outboxWorker.start();

	RabbitMQBusConfigurator.addConsumer(
		'ClientCreated',
		ClientCreatedHandlerConsumer,
		'ms-kitchen-queue',
		'patients',
		'patient.created'
	);

	// RabbitMQBusConfigurator.addConsumer(
	// 	'IngredientCreated',
	// 	IngredientCreatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'meal-plans',
	// 	'meal-plan.ingredient'
	// );

	// RabbitMQBusConfigurator.addConsumer(
	// 	'RecipeCreated',
	// 	RecipeCreatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'meal-plans',
	// 	'meal-plan.receta'
	// );

	// RabbitMQBusConfigurator.addConsumer(
	// 	'MealPlanCreated',
	// 	MealPlanCreatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'meal-plans',
	// 	'meal-plan.plan'
	// );

	// RabbitMQBusConfigurator.addConsumer(
	// 	'CalendarCreated',
	// 	CalendarCreatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'calendar',
	// 	'calendar.created'
	// );

	// RabbitMQBusConfigurator.addConsumer(
	// 	'AddressCreated',
	// 	AddressCreatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'calendar',
	// 	'address.created'
	// );

	// RabbitMQBusConfigurator.addConsumer(
	// 	'AddressUpdated',
	//  AddressUpdatedHandlerConsumer,
	// 	'ms-kitchen-queue',
	// 	'calendar',
	// 	'address.updated'
	// );


	RabbitMQBusConfigurator.start();

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
