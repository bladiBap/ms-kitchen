import { DataSource } from 'typeorm';
import { inject, injectable } from 'tsyringe';
import { ResultWithValue } from '@core/results/Result';
import { IRequestHandler } from '@core/interfaces/IRequestHandler';

import { AppDataSourceToken } from '@infrastructure/persistence/dataSource/DataSource';
import { GetPackagesByOrderQuery } from '@application/package/queries/getPackagesByOrderQuery/GetPackagesByOrderQuery';
import { PackageDTO } from '@application/package/dto/PackageDTO';
import { PackageEntity } from '@infrastructure/persistence/entities/Package';

@injectable()
export class GetPackagesByOrderHandler implements IRequestHandler<GetPackagesByOrderQuery, ResultWithValue<PackageDTO[]>> {

	constructor(
        @inject(AppDataSourceToken) private readonly dataSource: DataSource
	) {}

	async handle(query: GetPackagesByOrderQuery): Promise< ResultWithValue<PackageDTO[]>> {

		const orderId = query.orderId;
		const packageRepository = this.dataSource.getRepository(PackageEntity);

		const packages = await packageRepository.createQueryBuilder('package')
			.leftJoinAndSelect('package.client', 'client')
			.leftJoinAndSelect('package.address', 'address')
			.leftJoinAndSelect('package.packageItems', 'item')
			.leftJoinAndSelect('item.recipe', 'recipe')
			.where('package.orderId = :orderId', { orderId })
			.getMany();

		if (packages.length === 0) {
			return ResultWithValue.fromValue<PackageDTO[]>([]);
		}

		const packageDTOs: PackageDTO[] = packages.map(pack => ({
			id: pack.id,
			orderId: pack.orderId,
			code: pack.code,
			statusPackage: pack.status,
			datePackage: pack.datePackage,
			client: {
				id: pack.client.id,
				name: pack.client.name,
			},
			address: {
				latitude: pack.address.latitude,
				longitude: pack.address.longitude,
				reference: pack.address.reference,
			},
			listPackageItems: pack.packageItems.map(item => ({
				id: item.id,
				quantity: item.quantity,
				recipe: {
					id: item.recipe.id,
					name: item.recipe.name,
				}
			}))
		}));

		return ResultWithValue.fromValue<PackageDTO[]>(packageDTOs);
	}
}
