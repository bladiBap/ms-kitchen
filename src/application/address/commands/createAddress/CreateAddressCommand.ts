import { IRequest } from '@common/Core/Abstractions/IResquest';
import { IResult } from '@common/Core/Abstractions/IResult';

export class CreateAddressCommand implements IRequest<IResult> {
	_result!: IResult;
	constructor(
        public readonly date: Date,
		public readonly address: string,
		public readonly reference: string,
		public readonly latitude: number,
		public readonly longitude: number,
		public readonly calendarId: number,
	) {}
}
