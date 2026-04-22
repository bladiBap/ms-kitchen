import { IRequest } from '@core/interfaces/IRequest';
import { ResultWithValue } from '@core/results/Result';
import { IClientDeliveredDTO } from '@application/client/dto/ClientToDelivered';

export class GetClientsForDeliveredQuery implements IRequest<ResultWithValue<IClientDeliveredDTO[]>> {
	data!: ResultWithValue<IClientDeliveredDTO[]>;

	constructor(public readonly date : Date) {}
}
