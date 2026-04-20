import { Order } from '@infrastructure/Persistence/PersistenceModel/Entities/Order';
import { OrderDTO } from '@application/order/dto/OrderDTO';

export class OrderDTOMapper {
	static toDTO(order: Order): OrderDTO {
		return {
			id: order.id,
			dateOrdered: new Date(order.dateOrdered).toISOString().split('T')[0]!,
			dateCreatedOn: new Date(order.dateCreatedOn).toISOString().split('T')[0]!,
			status: order.status,
			orderItems: order.orderItems.map(item => ({
				id: item.id,
				quantity: item.quantityPlanned,
				status: item.status,
				recipe: {
					id: item.recipe.id,
					name: item.recipe.name,
					instructions: item.recipe.instructions,
					ingredients: item.recipe.ingredients.map(ri => ({
						id: ri.ingredient.id,
						name: ri.ingredient.name,
						measurementUnit: {
							id: ri.ingredient.measurementUnit.id,
							name: ri.ingredient.measurementUnit.name,
							simbol: ri.ingredient.measurementUnit.simbol
						}
					}))
				}
			}))
		};
	}
}
