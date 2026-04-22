import { IRequest } from '@core/interfaces/IRequest';
import { ResultWithValue } from '@core/results/Result';
import { PackageDTO } from '@application/package/dto/PackageDTO';

export class GetPackagesByOrderQuery implements IRequest<ResultWithValue<PackageDTO[]>> {
	data!: ResultWithValue<PackageDTO[]>;

	constructor(public readonly orderId: string) {
	}
}
