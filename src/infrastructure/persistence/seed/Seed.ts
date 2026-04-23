import 'reflect-metadata';
import 'dotenv/config';
import { randomUUID } from 'crypto';

import { DateUtils } from '@shared/utils/Date';
import { AppDataSource } from '@infrastructure/persistence/dataSource/DataSource';

import { ClientEntity } from '@infrastructure/persistence/entities/ClientEntity';
import { RecipeEntity } from '@infrastructure/persistence/entities/RecipeEntity';
import { AddressEntity } from '@infrastructure/persistence/entities/AddressEntity';
import { CalendarEntity } from '@infrastructure/persistence/entities/CalendarEntity';
import { MealPlanEntity } from '@infrastructure/persistence/entities/MealPlanEntity';
import { DayliDietEntity } from '@infrastructure/persistence/entities/DayliDietEntity';
import { IngredientEntity } from '@infrastructure/persistence/entities/IngredientEntity';
import { MeasurementUnitEntity } from '@infrastructure/persistence/entities/MeasurementUnitEntity';
import { RecipeIngredientEntity } from '@infrastructure/persistence/entities/RecipeIngredientEntity';

async function seed() {
	const appConection = await AppDataSource.initialize();

	await appConection.query('TRUNCATE TABLE "order_item", "order", "dayli_diet", "meal_plan", "calendar", "address", "recipe_ingredient", "recipe", "ingredient", "client", "measurement_unit", "daily_allocation", "allocation_line", "outbox_message" RESTART IDENTITY CASCADE;');
	console.log('Database cleaned!');

	const unitRepo = appConection.getRepository(MeasurementUnitEntity);
	const clientRepo = appConection.getRepository(ClientEntity);
	const ingredientRepo = appConection.getRepository(IngredientEntity);
	const recipeRepo = appConection.getRepository(RecipeEntity);
	const recipeIngRepo = appConection.getRepository(RecipeIngredientEntity);
	const addressRepo = appConection.getRepository(AddressEntity);
	const calendarRepo = appConection.getRepository(CalendarEntity);
	const mealPlanRepo = appConection.getRepository(MealPlanEntity);
	const dayliDietRepo = appConection.getRepository(DayliDietEntity);

	const [gram, piece] = await unitRepo.save([
		unitRepo.create({ id: randomUUID(), name: 'Gram', simbol: 'g' }),
		unitRepo.create({ id: randomUUID(), name: 'Piece', simbol: 'pc' }),
	]);

	const [client1, client2] = await clientRepo.save([
		clientRepo.create({ id: randomUUID(), name: 'John Doe' }),
		clientRepo.create({ id: randomUUID(), name: 'Jane Smith' }),
		clientRepo.create({ id: randomUUID(), name: 'Alice Johnson' }),
	]);

	const [rice, chicken, egg] = await ingredientRepo.save([
		ingredientRepo.create({ id: randomUUID(), name: 'Rice', measurementUnit: gram }),
		ingredientRepo.create({ id: randomUUID(), name: 'Chicken Breast', measurementUnit: gram }),
		ingredientRepo.create({ id: randomUUID(), name: 'Egg', measurementUnit: piece }),
	]);

	const [recipe1, recipe2] = await recipeRepo.save([
		recipeRepo.create({
			id: randomUUID(),
			name: 'Chicken Rice Bowl',
			instructions: 'Cook rice, grill chicken, and serve together.',
		}),
		recipeRepo.create({
			id: randomUUID(),
			name: 'Fried Egg',
			instructions: 'Fry an egg with a pinch of salt.',
		}),
	]);

	await recipeIngRepo.save([
		recipeIngRepo.create({ id: randomUUID(), recipe: recipe1, ingredient: rice, quantity: 200 }),
		recipeIngRepo.create({ id: randomUUID(), recipe: recipe1, ingredient: chicken, quantity: 150 }),
		recipeIngRepo.create({ id: randomUUID(), recipe: recipe2, ingredient: egg, quantity: 1 }),
	]);

	const calendar1 = calendarRepo.create({ id: randomUUID(), client: client1 });
	const calendar2 = calendarRepo.create({ id: randomUUID(), client: client2 });
	await calendarRepo.save([calendar1, calendar2]);

	const today = DateUtils.formatDate(new Date());
	const tomorrow = DateUtils.tomorrow(today);
	const dayAfterTomorrow = DateUtils.addDays(today, 2);

	const address1 = addressRepo.create({
		id: randomUUID(),
		date: today.toISOString().split('T')[0],
		address: 'Av. Principal 123',
		reference: 'Casa azul',
		latitude: -17.7833,
		longitude: -63.1821,
		calendar: calendar1,
	});
	const address2 = addressRepo.create({
		id: randomUUID(),
		date: today.toISOString().split('T')[0],
		address: 'Calle Secundaria 45',
		reference: 'Depto 2B',
		latitude: -17.7805,
		longitude: -63.1859,
		calendar: calendar2,
	});

	const address3 = addressRepo.create({
		id: randomUUID(),
		date: tomorrow.toISOString().split('T')[0],
		address: 'Calle Tercera 789',
		reference: 'Edificio rojo',
		latitude: -17.7790,
		longitude: -63.1835,
		calendar: calendar1,
	});

	const address4 = addressRepo.create({
		id: randomUUID(),
		date: tomorrow.toISOString().split('T')[0],
		address: 'Avenida Cuarta 101',
		reference: 'Casa verde',
		latitude: -17.7812,
		longitude: -63.1847,
		calendar: calendar2,
	});

	const address5 = addressRepo.create({
		id: randomUUID(),
		date: dayAfterTomorrow.toISOString().split('T')[0],
		address: 'Boulevard Quinta 202',
		reference: 'Depto 3C',
		latitude: -17.7825,
		longitude: -63.1860,
		calendar: calendar1,
	});

	const address6 = addressRepo.create({
		id: randomUUID(),
		date: dayAfterTomorrow.toISOString().split('T')[0],
		address: 'Calle Sexta 303',
		reference: 'Casa amarilla',
		latitude: -17.7838,
		longitude: -63.1872,
		calendar: calendar2,
	});

	await addressRepo.save([address1, address2, address3, address4, address5, address6]);

	const startDate = new Date(today);
	startDate.setDate(today.getDate() - 2);
	const endDate = new Date(today);
	endDate.setDate(today.getDate() + 2);

	const [mealPlan1, mealPlan2] = await mealPlanRepo.save([
		mealPlanRepo.create({
			id: randomUUID(),
			startDate,
			endDate,
			durationDays: 5,
			calendar: calendar1,
			client: client1,
		}),
		mealPlanRepo.create({
			id: randomUUID(),
			startDate,
			endDate,
			durationDays: 5,
			calendar: calendar2,
			client: client2,
		}),
	]);

	const diet1 = dayliDietRepo.create({
		id: randomUUID(),
		date: today,
		nDayPlan: 3,
		mealPlan: mealPlan1,
		recipes: [recipe1, recipe2],
	} as DayliDietEntity);
	const diet2 = dayliDietRepo.create({
		id: randomUUID(),
		date: today,
		nDayPlan: 3,
		mealPlan: mealPlan2,
		recipes: [recipe2],
	} as DayliDietEntity);

	const dietTomorrow1 = dayliDietRepo.create({
		id: randomUUID(),
		date: tomorrow,
		nDayPlan: 4,
		mealPlan: mealPlan1,
		recipes: [],
	});

	const dietTomorrow2 = dayliDietRepo.create({
		id: randomUUID(),
		date: tomorrow,
		nDayPlan: 4,
		mealPlan: mealPlan2,
		recipes: [],
	});

	const dietDayAfterTomorrow1 = dayliDietRepo.create({
		id: randomUUID(),
		date: dayAfterTomorrow,
		nDayPlan: 5,
		mealPlan: mealPlan1,
		recipes: [recipe1],
	} as DayliDietEntity);

	const dietDayAfterTomorrow2 = dayliDietRepo.create({
		id: randomUUID(),
		date: dayAfterTomorrow,
		nDayPlan: 5,
		mealPlan: mealPlan2,
		recipes: [recipe2],
	} as DayliDietEntity);

	await dayliDietRepo.save([diet1, diet2, dietTomorrow1, dietTomorrow2, dietDayAfterTomorrow1, dietDayAfterTomorrow2]);

	console.log('Database seeded successfully!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('Error seeding database:', err);
	process.exit(1);
});
