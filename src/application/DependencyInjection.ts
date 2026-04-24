import { container } from 'tsyringe';

import { CreateAddressCommand } from '@application/address/commands/createAddress/CreateAddressCommand';
import { CreateAddressHandler } from '@application/address/commands/createAddress/CreateAddressHandler';

import { DeleteAddressCommand } from '@application/address/commands/deleteAddress/DeleteAddressCommand';
import { DeleteAddressHandler } from '@application/address/commands/deleteAddress/DeleteAddressHandler';

import { UpdateAddressCommand } from '@application/address/commands/updateAddress/UpdateAddressCommand';
import { UpdateAddressHandler } from '@application/address/commands/updateAddress/UpdateAddressHandler';

import { GetAddressByIdQuery } from '@application/address/query/GetAddressByIdQuery';
import { GetAddressByIdHandler } from '@infrastructure/querys/address/GetAddressByIdHandler';

import { ClientCreatedCommand } from '@application/client/command/ClientCreatedCommand';
import { ClientCreatedHandler } from '@application/client/command/ClientCreatedHandler';

import { GetClientsForDeliveredQuery } from '@application/client/query/getClientsForDelivery/GetClientsForDeliveredQuery';
import { GetClientsForDeliveredHandler } from '@infrastructure/querys/client/GetClientsForDeliveredHandler';

import { GenerateOrderCommand } from '@application/order/commands/generateOrder/GenerateOrderCommand';
import { GenerateOrderHandler } from '@application/order/commands/generateOrder/GenerateOrderHandler';

import { IncreaseQuantityOrderItemCommand } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemCommand';
import { IncreaseQuantityOrderItemHandler } from '@application/order/commands/increaseQuantityOrderItem/IncreaseQuantityOrderItemHandler';

//Domain Events
import { OrderItemCompletedEvent } from '@domain/order/events/OrderItemCompletedEvent';
import { OrderItemCompletedEventHandler } from '@application/order/events/OrderItemCompletedEventHandler';

import { OrderCompletedEvent } from '@domain/order/events/OrderCompletedEvent';
import { PackageCreateEventHandler } from '@application/package/events/PackageCreateEventHandler';

container.register(CreateAddressCommand.name, {
	useClass: CreateAddressHandler,
});

container.register(UpdateAddressCommand.name, {
	useClass: UpdateAddressHandler,
});

container.register(DeleteAddressCommand.name, {
	useClass: DeleteAddressHandler,
});

container.register(GetAddressByIdQuery.name, {
	useClass: GetAddressByIdHandler,
});

container.register(ClientCreatedCommand.name, {
	useClass: ClientCreatedHandler,
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



// Domain Events
container.register(OrderItemCompletedEvent.name, {
	useClass: OrderItemCompletedEventHandler,
});

container.register(OrderCompletedEvent.name, {
	useClass: PackageCreateEventHandler,
});
