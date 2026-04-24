import { container } from 'tsyringe';
import { IUnitOfWorkToken } from '@core/interfaces/IUnitOfWork';
import { IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { UnitOfWork } from '@infrastructure/persistence/UnitOfWork';

//Repositories
import { AddressRepository } from '@infrastructure/persistence/repositories/AddressRepository';
import { IAddressRepositoryToken } from '@domain/address/repositories/IAddressRepository';

import { ClientRepository } from '@infrastructure/persistence/repositories/ClientRepository';
import { IClientRepositoryToken } from '@domain/client/repositories/IClientRepository';

import { OrderRepository } from '@infrastructure/persistence/repositories/OrderRepositorty';
import { IOrderRepositoryToken } from '@domain/order/repositories/IOrderRepository';

import { OrderItemRepository } from '@infrastructure/persistence/repositories/OrderItemRepository';
import { IOrderItemRepositoryToken } from '@domain/order/repositories/IOrderItemRepository';

import { RecipeRepository } from '@infrastructure/persistence/repositories/RecipeRepository';
import { IRecipeRepositoryToken } from '@domain/recipe/repositories/IRecipeRepository';

import { DailyAllocationRepository } from '@infrastructure/persistence/repositories/DailyAllocationRepository';
import { IDailyAllocationRepositoryToken } from '@domain/daily-allocation/repositories/IDailyAllocationRepository';

import { IPackageRepositoryToken } from '@domain/package/repositories/IPackageRepository';
import { PackageRepository } from '@infrastructure/persistence/repositories/PackageRepository';

//Queries
import { GetAddressByIdQuery } from '@application/address/query/GetAddressByIdQuery';
import { GetAddressByIdHandler } from '@infrastructure/querys/address/GetAddressByIdHandler';

import { GetOrderByDayHandler } from '@infrastructure/querys/order/GetOrderByDayHandler';
import { GetOrderByDayQuery } from '@application/order/queries/GetOrderByDayQuery';
import { GetOrderByIdQuery } from '@application/order/queries/GetOrderByIdQuery';
import { GetOrderByIdHandler } from '@infrastructure/querys/order/GetOrderByIdHandler';
import { GetAllOrdersQuery } from '@application/order/queries/GetAllOrdersQuery';
import { GetAllOrdersHandler } from '@infrastructure/querys/order/GetAllOrdersHandler';

import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';
import { GetClientsForDeliveredHandler } from '@infrastructure/querys/client/GetClientsForDeliveredHandler';

import { GetPackagesByOrderQuery } from '@application/package/queries/getPackagesByOrderQuery/GetPackagesByOrderQuery';
import { GetPackagesByOrderHandler } from '@infrastructure/querys/package/GetPackagesByOrderHandler';

//Integration Events
import { ClientCreatedCommand } from '@application/client/command/ClientCreatedCommand';
import { ClientCreatedHandler } from '@application/client/command/ClientCreatedHandler';

//Outbox
import { IExternalPublisherToken } from '@comunication/contracts/services/IExternalPublisher';
import { RabbitMQExternalPublisher } from '@comunication/rabbitMQ/services/RabbitMQExternalPublisher';
import { IOutboxServiceToken } from '@outbox/service/interface/IOutboxService';
import { OutboxService } from '@outbox/service/OutboxService';
import { IOutboxDatabaseToken } from '@outbox/repository/IOutboxDatabase';
import { IOutboxRepositoryToken } from '@outbox/repository/IOutboxRepository';
import { RabbitMQSettings } from '@comunication/rabbitMQ/services/RabbitMQSetting';
import { env } from '@shared/constants/env';

container.registerSingleton(IUnitOfWorkToken, UnitOfWork);
container.register(IEntityManagerProviderToken, {
	useToken: IUnitOfWorkToken,
});
container.register(IOutboxDatabaseToken, {
	useToken: IUnitOfWorkToken,
});

//Repositories
container.register(IAddressRepositoryToken, { useClass: AddressRepository });
container.register(IClientRepositoryToken, { useClass: ClientRepository });
container.register(IOrderRepositoryToken, { useClass: OrderRepository });
container.register(IRecipeRepositoryToken, { useClass: RecipeRepository });
container.register(IDailyAllocationRepositoryToken, { useClass: DailyAllocationRepository });
container.register(IOrderItemRepositoryToken, { useClass: OrderItemRepository });
container.register(IPackageRepositoryToken, { useClass: PackageRepository });

//Queries
container.register(GetAddressByIdQuery.name, { useClass: GetAddressByIdHandler });
container.register(GetClientsForDeliveredQuery.name, { useClass: GetClientsForDeliveredHandler });
container.register(GetPackagesByOrderQuery.name, { useClass: GetPackagesByOrderHandler });
container.register(GetOrderByDayQuery.name, { useClass: GetOrderByDayHandler });
container.register(GetOrderByIdQuery.name, { useClass: GetOrderByIdHandler });
container.register(GetAllOrdersQuery.name, { useClass: GetAllOrdersHandler });
//Integration Events
container.register(ClientCreatedCommand.name, { useClass: ClientCreatedHandler });

//Outbox
container.registerSingleton(IExternalPublisherToken, RabbitMQExternalPublisher);
container.registerSingleton(IOutboxServiceToken, OutboxService);
container.register(IOutboxRepositoryToken, { useToken: IOutboxServiceToken });

container.registerInstance(RabbitMQSettings, new RabbitMQSettings(
	5672,
	false,
	env.RABBITMQ_HOST,
	env.RABBITMQ_USERNAME,
	env.RABBITMQ_PASSWORD,
	env.RABBITMQ_VIRTUAL_HOST,
));
