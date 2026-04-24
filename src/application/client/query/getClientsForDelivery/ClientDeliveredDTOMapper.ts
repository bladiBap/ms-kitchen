import { AddressEntity } from '@infrastructure/persistence/entities/AddressEntity';
import { IClientDeliveredDTO } from '@application/client/dto/ClientToDelivered';

export class ClientDeliveredDTOMapper {

	static toDTO(addressByUser: AddressEntity[]): IClientDeliveredDTO[] {

		const lista: IClientDeliveredDTO[] = addressByUser.map((item) => ({
			clientName: item.calendar.mealPlan.client.name,
			id: item.calendar.mealPlan.client.id,
			address: {
				id: item.id,
				address: item.address,
				reference: item.reference,
				latitude: item.latitude,
				longitude: item.longitude,
			},
			recipes: item.calendar.mealPlan.dayliDiets.flatMap((diet: any) =>
				diet.dayliDietRecipes.map((dayliDietRecipe: any) => ({
					id: dayliDietRecipe.recipe.id,
					name: dayliDietRecipe.recipe.name,
					quantity: dayliDietRecipe.quantity,
				}))
			),
		}));

		return lista;
	}
}
