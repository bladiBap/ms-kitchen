import { inject, injectable } from 'tsyringe';
import { IEntityManagerProvider, IEntityManagerProviderToken } from '@core/interfaces/IEntityManagerProvider';

import { Address } from '@domain/address/entities/Address';
import { DateUtils } from '@shared/utils/Date';
import { IAddressRepository } from '@domain/address/repositories/IAddressRepository';

import { AddressEntity } from '@infrastructure/persistence/entities/AddressEntity';
import { AddressMapper } from '@infrastructure/persistence/mappers/AddressMapper';
import { RecipeByClientDTO } from '@application/order/dto/RecipeByClientDTO';

@injectable()
export class AddressRepository implements IAddressRepository {

	constructor(
        @inject(IEntityManagerProviderToken) private readonly emProvider: IEntityManagerProvider
	) {}

	async create(entity: Address): Promise<Address> {
		const manager = this.emProvider.getManager();
		const addressEntity = AddressMapper.toPersistence(entity);
		const entitySaved = await manager.getRepository(AddressEntity).save(addressEntity);
		return AddressMapper.toDomain(entitySaved);
	}

	async getById(id: string): Promise<Address | null> {
		const manager = this.emProvider.getManager();
		const address = await manager.getRepository(AddressEntity).findOne(
			{ where: { id: id }}
		);
		if (!address) {return null;}
		return AddressMapper.toDomain(address);
	}

	async getAll(): Promise<Address[]> {
		const manager = this.emProvider.getManager();
		const repo = manager.getRepository(AddressEntity);

		const rows = await repo.find({
			order: { date: 'DESC', id: 'DESC' }
		});

		return rows.map((row) => AddressMapper.toDomain(row));
	}

	async getRecipesByClient(date: Date): Promise<RecipeByClientDTO[]> {
		const manager = this.emProvider.getManager();
		const formattedDate = DateUtils.formatDate(date);
		const result = await manager.query(`
            SELECT
                c."id" AS "clientId",
                c."name" AS "clientName",
                ddr."recipeId" AS "recipeId",
                COUNT(ddr."recipeId") AS "quantity"
            FROM "address" a
            INNER JOIN "calendar" cal ON cal."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."id" = cal."mealPlanId"
            INNER JOIN "client" c ON c."id" = mp."clientId"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            WHERE a."date" = $1
                AND mp."startDate" <= $1::date
                AND mp."endDate" >= $1::date
                AND dd."date" = $1
                AND a."needsDelivery" = true
            GROUP BY c."id", c."name", ddr."recipeId";`,
		[formattedDate]
		);
		if (result.length === 0) {
			return [];
		}
		const clientNeeds: RecipeByClientDTO[] = result.map((row: any) => ({
			clientId: row.clientId,
			recipeId: row.recipeId,
			quantity: row.quantity,
		}));
		return clientNeeds;
	}

	async getClientsForDeliveredInformation(date: Date): Promise<any[]> {
		const manager = this.emProvider.getManager();
		const formattedDate = date.toISOString().split('T')[0];

		return await manager.query(
			`
            SELECT
                c."name" AS "clientName",
                c."id" AS "clientId",
                a."address" AS "clientAddress",
                a."reference" AS "reference",
                a."latitude" AS "latitude",
                a."longitude" AS "longitude",
                a."id" AS "addressId",
                r."name" AS "recipeName",
                r."id"   AS "recipeId"
            FROM "address" a
            INNER JOIN "calendar" cal ON cal."id" = a."calendarId"
            INNER JOIN "meal_plan" mp ON mp."id" = cal."mealPlanId"
            INNER JOIN "client" c ON c."id" = mp."clientId"
            INNER JOIN "dayli_diet" dd ON dd."mealPlanId" = mp."id"
            INNER JOIN "dayli_diet_recipes" ddr ON ddr."dayliDietId" = dd."id"
            INNER JOIN "recipe" r ON r."id" = ddr."recipeId"
            WHERE a."date"::date = $1
                AND mp."startDate" <= $1::date
                AND mp."endDate" >= $1::date
				AND a."needsDelivery" = true
            ORDER BY c."name", r."name";
            `,
			[formattedDate]
		);
	}

	async getAddressByDateAndClientId(clientId: string, date: Date): Promise<Address | null> {

		const start = new Date(date);
		start.setHours(0, 0, 0, 0);

		const end = new Date(date);
		end.setHours(23, 59, 59, 999);

		const manager = this.emProvider.getManager();

		const addressRaw = await manager
			.getRepository(AddressEntity)
			.createQueryBuilder('a')
			.innerJoin('a.calendar', 'cal')
			.innerJoin('cal.mealPlan', 'mp')
			.where('mp.clientId = :clientId', { clientId })
			.andWhere('a.date::date >= :start AND a.date::date < :end', { start: start.toISOString(), end: end.toISOString() })
			.orderBy('a.date', 'DESC')
			.getOne();

		if (addressRaw === null) {return null;}

		return AddressMapper.toDomain(addressRaw);
	}

	async update(address: Address): Promise<Address> {
		const manager = this.emProvider.getManager();
		const addressEntity = AddressMapper.toPersistence(address);
		await manager.getRepository(AddressEntity).save(addressEntity);
		return address;
	}

	async delete(id: string): Promise<void> {
		const manager = this.emProvider.getManager();
		await manager.getRepository(AddressEntity).delete({ id });
	}
}
