import { Calendar } from '@domain/calendar/entities/Calendar';
import { CalendarEntity } from '@infrastructure/persistence/entities/CalendarEntity';
import { ClientEntity } from '@infrastructure/persistence/entities/ClientEntity';
import { MealPlanEntity } from '@infrastructure/persistence/entities/MealPlanEntity';

export class CalendarMapper {

	static toPersistence(domain: Calendar): CalendarEntity {
		const client = new ClientEntity();
		client.id = domain.getClientId();

		const mealPlan = new MealPlanEntity();
		mealPlan.id = domain.getMealPlanId();

		const calendarEntity = new CalendarEntity();
		calendarEntity.id = domain.getId();
		calendarEntity.client = client;
		calendarEntity.mealPlan = mealPlan;
		calendarEntity.clientId = domain.getClientId();

		return calendarEntity;
	}

	static toDomain(entity: CalendarEntity): Calendar {
		const clientId = entity.clientId ?? entity.client?.id;
		const mealPlanId = entity.mealPlan?.id;

		return new Calendar(
			entity.id,
			clientId,
			mealPlanId
		);
	}
}