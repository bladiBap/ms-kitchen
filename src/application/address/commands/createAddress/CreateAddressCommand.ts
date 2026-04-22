import { Result } from '@core/results/Result';
import { IRequest } from '@core/interfaces/IRequest';

export class CreateAddressCommand implements IRequest<Result> {
	data!: Result;
	constructor(
        public readonly date: Date,
		public readonly address: string,
		public readonly reference: string,
		public readonly latitude: number,
		public readonly longitude: number,
		public readonly calendarId: string,
	) {}
}
