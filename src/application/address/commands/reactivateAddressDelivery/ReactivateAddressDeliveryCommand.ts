import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class ReactivateAddressDeliveryCommand implements IRequest<Result> {
	data!: Result;

	constructor(
		public readonly calendarId: string,
		public readonly addressId: string,
	) {}
}