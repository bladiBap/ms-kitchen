import { container } from 'tsyringe';

import { CreateAddressCommand } from '@application/address/commands/createAddress/CreateAddressCommand';
import { CreateAddressHandler } from '@application/address/commands/createAddress/CreateAddressHandler';

import { DeleteAddressCommand } from '@application/address/commands/deleteAddress/DeleteAddressCommand';
import { DeleteAddressHandler } from '@application/address/commands/deleteAddress/DeleteAddressHandler';

import { UpdateAddressCommand } from '@application/address/commands/updateAddress/UpdateAddressCommand';
import { UpdateAddressHandler } from '@application/address/commands/updateAddress/UpdateAddressHandler';

import { CancelAddressDeliveryCommand } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryCommand';
import { CancelAddressDeliveryHandler } from '@application/address/commands/cancelAddressDelivery/CancelAddressDeliveryHandler';

import { ReactivateAddressDeliveryCommand } from '@application/address/commands/reactivateAddressDelivery/ReactivateAddressDeliveryCommand';
import { ReactivateAddressDeliveryHandler } from '@application/address/commands/reactivateAddressDelivery/ReactivateAddressDeliveryHandler';

import { GetAddressByIdQuery } from '@application/address/query/GetAddressByIdQuery';
import { GetAddressByIdHandler } from '@infrastructure/querys/address/GetAddressByIdHandler';

import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';
import { GetClientsForDeliveredHandler } from '@infrastructure/querys/client/GetClientsForDeliveredHandler';

import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';
import { GenerateOrderHandler } from '@application/order/commands/generateOrder/GenerateOrderHandler';

import { IncreaseQuantityOrderItemCommand } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { IncreaseQuantityOrderItemHandler } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemHandler';

import { CompletePackageCommand } from '@application/package/commands/completePackage/CompletePackageCommand';
import { CompletePackageHandler } from '@application/package/commands/completePackage/CompletePackageHandler';

// Integration Events
import { ClientCreatedCommand } from '@application/client/command/ClientCreatedCommand';
import { ClientCreatedHandler } from '@application/client/command/ClientCreatedHandler';

import { CreateIngredientCommand } from '@application/ingredient/commands/createIngredient/CreateIngredientCommand';
import { CreateIngredientHandler } from '@application/ingredient/commands/createIngredient/CreateIngredientHandler';

import { CreateRecipeCommand } from '@application/recipe/commands/createRecipe/CreateRecipeCommand';
import { CreateRecipeHandler } from '@application/recipe/commands/createRecipe/CreateRecipeHandler';

import { CreateMealPlanCommand } from '@application/mealPlan/commands/createMealPlan/CreateMealPlanCommand';
import { CreateMealPlanHandler } from '@application/mealPlan/commands/createMealPlan/CreateMealPlanHandler';

import { CreateCalendarCommand } from '@application/calendar/command/CreateCalendarCommand';
import { CreateCalendarHandler } from '@application/calendar/command/CreateCalendarHandler';

//Domain Events
import { OrderItemCompletedEvent } from '@domain/order/events/OrderItemCompletedEvent';
import { OrderItemCompletedEventHandler } from '@application/order/events/OrderItemCompletedEventHandler';

import { OrderCompletedEvent } from '@domain/order/events/OrderCompletedEvent';
import { PackageCreateEventHandler } from '@application/package/events/PackageCreateEventHandler';

import { PackageCompletedEvent } from '@domain/package/events/PackageCompletedEvent';
import { CompletedPackageEventHandler } from '@application/package/events/PackageCompletedEventHandler';

// Outbox Messages to publish
import { PackageCompletedOutboxMessage } from '@domain/package/events/outbox/PackageCompletedOutboxMessage';
import { PackageCompletedHandler } from '@application/outboxMessageHandler/PackageCompletedHandler';

import { PackageAllCompletedOutboxMessage } from '@domain/package/events/outbox/PackageAllCompletedOutboxMessage';
import { PackageAllCompletedHandler } from '@application/outboxMessageHandler/PackageAllCompletedHandler';

// Command and Query Handlers
container.register(CreateAddressCommand.name, {
	useClass: CreateAddressHandler,
});

container.register(UpdateAddressCommand.name, {
	useClass: UpdateAddressHandler,
});

container.register(CancelAddressDeliveryCommand.name, {
	useClass: CancelAddressDeliveryHandler,
});

container.register(ReactivateAddressDeliveryCommand.name, {
	useClass: ReactivateAddressDeliveryHandler,
});

container.register(DeleteAddressCommand.name, {
	useClass: DeleteAddressHandler,
});

container.register(GetAddressByIdQuery.name, {
	useClass: GetAddressByIdHandler,
});

container.register(GetClientsForDeliveredQuery.name, {
	useClass: GetClientsForDeliveredHandler,
});

container.register(GenerateOrderCommand.name, {
	useClass: GenerateOrderHandler,
});

container.register(IncreaseQuantityOrderItemCommand.name, {
	useClass: IncreaseQuantityOrderItemHandler,
});

container.register(CompletePackageCommand.name, {
	useClass: CompletePackageHandler,
});

// Integration Events Handlers
container.register(CreateIngredientCommand.name, {
	useClass: CreateIngredientHandler,
});

container.register(CreateRecipeCommand.name, {
	useClass: CreateRecipeHandler,
});

container.register(ClientCreatedCommand.name, {
	useClass: ClientCreatedHandler
});

container.register(CreateMealPlanCommand.name, {
	useClass: CreateMealPlanHandler,
});

container.register(CreateCalendarCommand.name, {
	useClass: CreateCalendarHandler,
});

// Domain Events
container.register(OrderItemCompletedEvent.name, {
	useClass: OrderItemCompletedEventHandler,
});

container.register(OrderCompletedEvent.name, {
	useClass: PackageCreateEventHandler,
});

container.register(PackageCompletedEvent.name, {
	useClass: CompletedPackageEventHandler,
});



// Outbox Messages to publish handlers

container.register(PackageCompletedOutboxMessage.name, {
	useClass: PackageCompletedHandler,
});

container.register(PackageAllCompletedOutboxMessage.name, {
	useClass: PackageAllCompletedHandler,
});
