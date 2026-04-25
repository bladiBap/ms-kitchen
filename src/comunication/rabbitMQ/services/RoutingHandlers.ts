import { AddressCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/AddressCreatedHandlerConsumer';
import { AddressDeliveryCanceledHandlerConsumer } from '@infrastructure/rabbitMQ/AddressDeliveryCanceledHandlerConsumer';
import { AddressDeliveryReactivatedHandlerConsumer } from '@infrastructure/rabbitMQ/AddressDeliveryReactivatedHandlerConsumer';
import { AddressUpdatedHandlerConsumer } from '@infrastructure/rabbitMQ/AddressUpdatedHandlerConsumer';
import { CalendarCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/CalendarCreatedHandlerConsumer';
import { ClientCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/ClientCreatedHandlerConsumer';
import { IngredientCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/IngredientCreatedHandlerConsumer';
import { MealPlanCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/MealPlanCreatedHandlerConsumer';
import { RecipeCreatedHandlerConsumer } from '@infrastructure/rabbitMQ/RecipeCreatedHandlerConsumer';

export const RoutingHandlers: { [routingKey: string]: any } = {
	'patient.created': ClientCreatedHandlerConsumer,
	'meal-plan.ingredient': IngredientCreatedHandlerConsumer,
	'meal-plan.receta': RecipeCreatedHandlerConsumer,
	'meal-plan.plan': MealPlanCreatedHandlerConsumer,
	'calendar.created': CalendarCreatedHandlerConsumer,
	'calendar.addressadded': AddressCreatedHandlerConsumer,
	'calendar.addressupdated': AddressUpdatedHandlerConsumer,
	'calendar.deliverycancelled': AddressDeliveryCanceledHandlerConsumer,
	'calendar.deliveryreactivated': AddressDeliveryReactivatedHandlerConsumer
}
